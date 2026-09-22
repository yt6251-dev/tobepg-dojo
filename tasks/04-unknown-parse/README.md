# 04 unknown を安全に型へ

AI: **ペア**（AIに書かせてよい。合格には `--explain` で自分の説明が3文以上要る）
目安: 90分 / 参考: Handbook「Narrowing」 Zod の README（ただし Zod は使わない）

## 課題

外から来た JSON（`unknown`）を `Account` 型に変換する。Zod のようなライブラリは使わず 自分で検証を書く。

```ts
type Account = {
  id: string;                       // 空でない
  email?: string;                   // あれば "@" を含む
  permissions: Record<string, boolean>; // 値は真偽値だけ。文字列の "false" は不合格
  teamIds: string[];                    // 無ければ []
};
```

1. `parseAccount(input: unknown): Result<Account>` — 課題02の `Result` を使う（`import` してよい）
2. 失敗の `error.code` は `"NOT_OBJECT" | "BAD_ID" | "BAD_EMAIL" | "BAD_PERMS" | "BAD_TEAMS"`
3. `parseAccounts(input: unknown): Account[]` — 配列でもオブジェクト（値の集合）でも受け 不正なものは捨てる

## 合格条件

- `task.test.ts` が全部通る
- `npm run grade -- 04 --explain "..."`（なぜその順で検証するか どこで型が確定するか を自分の言葉で）

## なぜこれか

「権限の入り切りは真偽値で持つ」を入口で確定させる課題。JSON で `"false"` という**文字列**が混ざると `if (perm)` が常に真になり **権限が全開になる**。実際に起きる事故なので 境界で型を確定させて防ぐ。
