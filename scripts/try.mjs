// 練習用。記録に残らない。ファイルを保存するたびにテストが走る。
//   npm run try -- 01        課題01のテストを監視モードで回す
//   npm run try              開いている課題を一覧表示
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CUR = JSON.parse(readFileSync(resolve(ROOT, "curriculum.json"), "utf8"));
const arg = process.argv[2];
const task = CUR.tasks.find((t) => t.id === arg || t.slug === arg);

if (!task) {
  console.log("使い方: npm run try -- <id>\n");
  for (const t of CUR.tasks) console.log(`  ${t.id}  ${t.slug}`);
  process.exit(arg ? 2 : 0);
}
if (task.type !== "test") {
  console.log(`${task.slug} はテストで採点しない課題（${task.type}）。README を読んで npm run grade で提出する`);
  process.exit(0);
}
console.log(`${task.slug} を監視中。starter.ts を保存するたびにテストが走る。q で終了。\n`);
spawnSync("npx", ["vitest", "--typecheck", resolve(ROOT, "tasks", task.slug)], { cwd: ROOT, stdio: "inherit" });
