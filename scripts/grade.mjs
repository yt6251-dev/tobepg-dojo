// 採点コマンド。 使い方:
//   npm run grade -- 01                       テスト課題を採点
//   npm run grade -- 01 --no-ai               AIオフ課題は「使わなかった」宣言が必要
//   npm run grade -- 04 --explain "3行以上"    AIペア課題は自分の説明が必要
//   npm run grade -- 05 --evidence "<commit や URL>" --note "..."   証拠つき課題
//   npm run grade -- --status                 進捗一覧
//
// ローカルで試行錯誤するだけなら `npm run test:task` (記録しない)。
// 記録に残るのはこのコマンドだけ。Not Yet の後は待機時間が過ぎるまで再採点できない。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CUR = JSON.parse(readFileSync(resolve(ROOT, "curriculum.json"), "utf8"));
const RES_PATH = resolve(ROOT, "results/results.json");
const results = existsSync(RES_PATH) ? JSON.parse(readFileSync(RES_PATH, "utf8")) : {};

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? (argv[i + 1] ?? true) : undefined; };
const has = (name) => argv.includes(name);
const taskArg = argv.find((a) => !a.startsWith("--") && !argv[argv.indexOf(a) - 1]?.startsWith("--"));

const statusOf = (id) => results[id]?.status ?? "open";
const passed = (id) => statusOf(id) === "passed";
const isOpen = (t) => t.requires.every(passed);

const width = (s) => [...s].reduce((n, c) => n + (/[^\x00-\xff]/.test(c) ? 2 : 1), 0);
const pad = (s, n) => s + " ".repeat(Math.max(0, n - width(s)));

if (has("--status") || !taskArg) {
  console.log(`\n  ${pad("課題", 26)}${pad("状態", 10)}${pad("週", 4)}${pad("AI", 6)}前提`);
  for (const t of CUR.tasks) {
    const st = passed(t.id) ? "合格" : statusOf(t.id) === "not_yet" ? "Not Yet" : isOpen(t) ? "挑戦可" : "ロック";
    console.log(`  ${pad(t.slug, 26)}${pad(st, 10)}${pad(String(t.week), 4)}${pad(t.ai, 6)}${t.requires.join(",") || "-"}`);
  }
  console.log("\n  練習 npm run try -- <id>   提出 npm run grade -- <id>\n");
  process.exit(0);
}

const task = CUR.tasks.find((t) => t.id === taskArg || t.slug === taskArg);
if (!task) { console.error(`課題が見つからない: ${taskArg}`); process.exit(2); }
if (!isOpen(task)) { console.error(`ロック中。先に ${task.requires.filter((r) => !passed(r)).join(", ")} を通す`); process.exit(3); }
if (passed(task.id)) { console.log(`${task.slug} は合格済み`); process.exit(0); }

const rec = results[task.id] ?? { status: "open", attempts: [] };
const last = rec.attempts.at(-1);
if (rec.status === "not_yet" && last) {
  const waitMs = CUR.waitHoursAfterNotYet * 3600 * 1000;
  const remain = new Date(last.at).getTime() + waitMs - Date.now();
  if (remain > 0) {
    console.log(`Not Yet の待機中。あと ${Math.ceil(remain / 3600000)} 時間。練習は npm run try -- ${task.id} で`);
    process.exit(4);
  }
}

let ok = false, detail = {};
if (task.type === "test") {
  const dir = resolve(ROOT, "tasks", task.slug);
  const r = spawnSync("npx", ["vitest", "run", dir, "--reporter=json", "--typecheck"], { cwd: ROOT, encoding: "utf8" });
  const json = r.stdout.slice(r.stdout.indexOf("{"));
  let summary = { numPassedTests: 0, numFailedTests: 0 };
  try { summary = JSON.parse(json); } catch { /* vitest が落ちたときは失敗扱い */ }
  detail = { passedTests: summary.numPassedTests ?? 0, failedTests: summary.numFailedTests ?? 0 };
  ok = r.status === 0 && detail.failedTests === 0 && detail.passedTests > 0;
  if (!ok) {
    const failed = (summary.testResults ?? []).flatMap((f) => (f.assertionResults ?? []).filter((a) => a.status === "failed"));
    if (failed.length) {
      console.log("\n落ちたテスト:");
      for (const a of failed) console.log(`  x ${a.fullName}\n      ${(a.failureMessages?.[0] ?? "").split("\n")[0]}`);
    } else {
      console.log((r.stderr || r.stdout).slice(0, 3000));
    }
  }
} else if (task.type === "evidence") {
  const ev = flag("--evidence");
  if (!ev || ev === true) { console.error(`--evidence "<commit ハッシュか URL>" が必要`); process.exit(5); }
  detail = { evidence: ev, note: flag("--note") ?? "" };
  ok = true;
}

// 合格に必要な宣言
if (ok && task.ai === "off" && !has("--no-ai")) {
  console.log("テストは通った。AIオフ課題なので --no-ai を付けて再実行すると合格が記録される");
  process.exit(6);
}
if (ok && task.ai === "pair") {
  const ex = flag("--explain");
  const lines = typeof ex === "string" ? ex.split(/\n|。/).filter((s) => s.trim()).length : 0;
  if (lines < 3) {
    console.log("通ったが AIペア課題なので --explain に自分の言葉で3文以上の説明を付けると合格が記録される");
    process.exit(7);
  }
  detail.explain = ex;
}

rec.attempts.push({ at: new Date().toISOString(), ok, ...detail });
rec.status = ok ? "passed" : "not_yet";
results[task.id] = rec;
writeFileSync(RES_PATH, JSON.stringify(results, null, 2) + "\n");

if (ok) {
  console.log(`\n合格: ${task.slug}`);
  const next = CUR.tasks.filter((t) => !passed(t.id) && t.id !== task.id && isOpen(t));
  if (next.length) console.log(`開いた課題: ${next.map((t) => t.slug).join(", ")}`);
} else {
  console.log(`\nNot Yet: ${task.slug}。${CUR.waitHoursAfterNotYet} 時間後に再採点できる。それまでは npm run try -- ${task.id} で練習する`);
  process.exit(1);
}
