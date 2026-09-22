# 01 型の絞り込み（narrowing）

AI: **オフ**（`--no-ai` を付けて採点）
目安: 60分 / 参考: 『プロを目指す人のためのTypeScript入門』第6章 / Handbook「Narrowing」

## 課題

`starter.ts` の3つの関数を実装する。型注釈は変えない。`any` と `as` は使わない。

1. `describe(v: string | number | boolean | null | undefined): string`
   - 文字列 → `text:<中身>` 数値 → `number:<値>` 真偽値 → `bool:true|false` null / undefined → `empty`
2. `isNonEmptyString(x: unknown): x is string` — 型ガード
3. `firstDefined<T>(items: (T | null | undefined)[]): T | undefined` — 最初の null でも undefined でもない要素

## 合格条件

- `task.test.ts` が全部通る（型チェック込み）
- `npm run grade -- 01 --no-ai`

## なぜこれか

外部APIの戻り値は 配列のことも オブジェクトのことも null のこともある。`Array.isArray(r) ? r : Object.values(r ?? {})` のように受ける場面は日常的に出てくる。この「何が来るか分からない値を安全に絞る」が narrowing。
