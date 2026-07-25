# 犬山数学理科特化塾 ウェブサイト

塾の公式サイト。素の HTML / CSS / JavaScript のみで作られています。

## 前提

- **ビルド工程なし**。npm もフレームワークも使っていません。HTML を直接編集します
- **各ページが自己完結**しています。CSS は各 HTML の `<style>`、JS は `<script>` に内蔵。共通の外部ファイルは使いません
- `style.css` と `main.js` は**どの HTML からも読み込まれていない残骸**です。編集しても本番に影響しません
- ファイルは LF で保存され git が CRLF に変換します。`LF will be replaced by CRLF` の警告は正常です

## デプロイ

master ブランチに push すると Vercel が自動デプロイします。ステージング環境はありません。

`vercel.json` で `cleanUrls: true` にしているため、**内部リンクは `.html` を付けずに書きます**（`/courses`、`/booking` など）。

## ページ構成

| ファイル | 内容 |
|---|---|
| `index.html` | トップ |
| `instructors.html` | 講師紹介 |
| `results.html` | 合格実績・体験記 |
| `courses.html` | コース・料金 |
| `intensive.html` | 季節講習 |
| `gallery.html` | 塾内写真 |
| `access.html` | アクセス |
| `legal.html` | 特定商取引法表記 |
| `booking.html` | 無料体験予約フォーム |
| `apply.html` | 季節講習 申込フォーム |
| `apply-complete.html` | 申込完了ページ |
| `intensive-template.html` | 季節講習ページの雛形（gitignore 済み・ローカル専用） |

## フォーム（サーバーレス構成）

`booking.html` と `apply.html` は **EmailJS + Google Apps Script** で動いています。

- EmailJS を CDN から読み込み、塾宛と申込者宛の2通を送信
- GAS の Web アプリ URL へ POST してスプレッドシートに記録
- キーや URL は各 HTML の `<script>` 冒頭に定数として直書きされています
- 本番の GAS コードは Google 側にあります。リポジトリの `gas-script.gs` は gitignore 対象のローカルメモです

### honeypot の扱い

スパム対策の honeypot 項目がありますが、**値が入っていても送信をブロックしません**。GAS 側でスパム疑いフラグを立てて記録します。パスワードマネージャの自動入力で正規の申込が誤ってブロックされた経緯があるため、この方針を変えないでください。

## 季節講習の運用

季節講習は毎回同じフォーマットです。

1. `intensive-template.html` をベースに `intensive.html` を作る
2. 開講していない期間は Coming Soon 版に差し替える
3. `apply.html` の `COURSES` 配列を、その講習の講座一覧に書き換える

`intensive.html` 末尾の JS に運用フラグが2つあります。

- `MANUAL_OPEN` — 申込ボタンを表示するかどうか
- `CLOSED` — `true` にすると「◯◯講習の申込は終了しました。」というクリック不可の表示に差し替わる

## アナリティクス

GA4（`G-TLJQ87F61R`）を全ページの `<head>` 内、viewport meta の直後に設置しています。
`intensive-template.html` にも入っているので、雛形からコピーしたページにも自動で付いてきます。

**新しいページを作るときは、このタグを忘れずに入れてください。**
