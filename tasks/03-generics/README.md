# 03 ジェネリクス

AI: **オフ**
目安: 90分 / 参考: 『プロを目指す人のためのTypeScript入門』第4章 / type-challenges easy

## 課題

`starter.ts` を実装する。`any` 禁止。型引数の制約（`extends`）と `keyof` を使う。

1. `groupBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, T[]>`
2. `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`
3. `uniqueBy<T>(items: T[], key: (t: T) => string | number): T[]` — 最初に出た要素を残す

## 合格条件

- `task.test.ts` が全部通る（型のテストを含む）
- `npm run grade -- 03 --no-ai`

## なぜこれか

「グループごとの件数を返す」API はどこにでもある。`groupBy` はその一般形。`pick` は **API が秘密の項目を落として返す**処理の型安全版で これを型で書いておくと 落とし忘れがコンパイルエラーになる。
