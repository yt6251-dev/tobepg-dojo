# TobePG Dojo

QA エンジニアから AI駆動開発エンジニアへ移るための 12週間の自習場。課題を解いて `npm run grade` で採点し 合格した課題の次が開く。

計画の本体は `../TobePG/`（カリキュラム 実践課題 スケジュール 進捗）。このリポジトリは課題と採点器と進捗の置き場。

## 最初にやること

```sh
npm install
npm run grade -- --status        # 課題の一覧。第1週は 01 だけ開いている
cat tasks/01-ts-narrowing/README.md
```

## 課題の進め方

1. `tasks/<slug>/README.md` を読む。合格条件と AI モード（off / pair）が書いてある
2. `tasks/<slug>/starter.ts` を実装する
3. 試行は `npm run test:task`（記録に残らない。何度でも）
4. 提出は `npm run grade -- <id>`（記録に残る）
   - AI オフ課題: `--no-ai` を付ける
   - AI ペア課題: `--explain "自分の言葉で3文以上"` を付ける
   - 証拠つき課題: `--evidence "<commit や URL>" --note "..."`
5. 落ちたら **Not Yet**。24時間は再提出できない。その間は `test:task` で試すか 先生モードの AI に聞く

## ダッシュボード

```sh
npm run dev      # http://localhost:3000
```

第1週は `results/results.json` を表示するだけ。以降の機能追加は自分の課題:
第2週 前提関係の表示 / 第3週 Postgres へ移行 / 第4週 GitHub ログイン / 第7〜8週 採点器の自作 / 第9〜10週 空テスト検出（TestLens）

## AI の使い方

| モード | ルール |
|---|---|
| 先生 | 概念の説明とエラーの意味を聞く。制限なし |
| ペア | 書かせてよい。ただし合格時に自分の説明が要る。説明できなければ書き直す |
| オフ | AI を閉じる。15分詰まったらメモして翌日に先生モードで聞く |

## 構成

```
curriculum.json      課題の順序と前提関係 待機時間
tasks/<slug>/        README.md starter.ts task.test.ts
results/results.json 採点結果（コミットする。進捗の記録そのもの）
scripts/grade.mjs    採点器
apps/dashboard/      Next.js 15 の進捗表示
```
