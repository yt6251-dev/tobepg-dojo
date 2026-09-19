// 第1週の静的ダッシュボード。curriculum.json と results/results.json を読むだけ。
// 第2週の課題: 前提関係の表示を自分で実装する。第3週: results を Postgres に移す。
import curriculum from "../../../curriculum.json";
import resultsJson from "../../../results/results.json";

type Task = { id: string; slug: string; title: string; week: number; type: string; ai: string; requires: string[] };
type Attempt = { at: string; ok: boolean; passedTests?: number; failedTests?: number; evidence?: string };
type Rec = { status: "passed" | "not_yet" | "open"; attempts: Attempt[] };

// Vercel では push 時点の JSON がビルドに焼き込まれる（第3週に Postgres へ移すまでの暫定）
export const dynamic = "force-static";

export default function Page() {
  const tasks = curriculum.tasks as Task[];
  const results = resultsJson as Record<string, Rec>;
  const passed = (id: string) => results[id]?.status === "passed";
  const stateOf = (t: Task) =>
    passed(t.id) ? "合格" : results[t.id]?.status === "not_yet" ? "Not Yet" : t.requires.every(passed) ? "挑戦可" : "ロック";
  const done = tasks.filter((t) => passed(t.id)).length;

  return (
    <main>
      <h1>TobePG Dojo</h1>
      <p>
        合格 {done} / {tasks.length}
      </p>
      <table cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #999" }}>
            <th>週</th><th>課題</th><th>状態</th><th>AI</th><th>前提</th><th>最終挑戦</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const st = stateOf(t);
            const last = results[t.id]?.attempts.at(-1);
            const color = st === "合格" ? "#1a7f37" : st === "Not Yet" ? "#b35900" : st === "ロック" ? "#999" : "#0969da";
            return (
              <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{t.week}</td>
                <td>
                  <a href={`https://github.com/yt6251-dev/tobepg-dojo/tree/main/tasks/${t.slug}`} target="_blank" rel="noreferrer">
                    {t.slug}
                  </a>{" "}
                  — {t.title}
                </td>
                <td style={{ color, fontWeight: 600 }}>{st}</td>
                <td>{t.ai}</td>
                <td>{t.requires.join(", ") || "-"}</td>
                <td>{last ? new Date(last.at).toLocaleString("ja-JP") : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ marginTop: "2rem", color: "#666" }}>
        採点: <code>npm run grade -- &lt;id&gt;</code> / 試行: <code>npm run test:task</code>
      </p>
    </main>
  );
}
