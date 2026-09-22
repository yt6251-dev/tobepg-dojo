# 02 判別可能な union（discriminated union）

AI: **オフ**
目安: 60分 / 参考: 『プロを目指す人のためのTypeScript入門』第6章「タグ付きユニオン」

## 課題

API の結果を `{ ok: true; data } | { ok: false; error }` で表す。`starter.ts` を実装する。

1. `ok<T>(data: T): Result<T>` と `fail(code, message): Result<never>`
2. `unwrap<T>(r: Result<T>): T` — 失敗なら `Error(message)` を投げる
3. `mapResult<T, U>(r: Result<T>, f: (t: T) => U): Result<U>`
4. `describeError(r: Result<unknown>): string` — 成功なら `"ok"` 失敗なら `"<code>: <message>"`。**`switch` の網羅性チェック（`never`）を使う**

## 合格条件

- `task.test.ts` が全部通る
- `npm run grade -- 02 --no-ai`

## なぜこれか

多くの API は `{ ok: false, error: "NOT_SIGNED_IN" }` の形で失敗を返す。契約テストで確かめる「応答は必ず `ok` を持つ」「失敗側で `data` に触れない」を **型で保証する**のがこれ。テストを書く前に コンパイラに守らせる。
