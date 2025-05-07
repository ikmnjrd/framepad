# FramePad: フレーム単位ゲーム入力フォーマットパーサーとマッパー

フレーム単位で正確に操作するための指示フォーマットを解析し、ゲーム機ごとのマッパーとコンパイラを提供するライブラリです。

## 概要

FramePadは、フレーム単位のゲーム入力を記述するためのテキストフォーマットを定義し、それを解析・変換するためのツールセットを提供します。スクリプトやオートプレイなどへの活用を視野に入れた機械処理を前提としています。

## 機能

- テキストフォーマットの解析と検証
- ファミコン（NES）形式への変換と逆変換
- バイナリデータへの変換とバイナリからの復元
- CSV/JSON形式への出力
- フレーム入力の可視化表示

## 採用フォーマット

```
<start_frame>[-<end_frame>]: <buttons>
```

### 項目説明

- start_frame: 入力開始フレーム（0ベース、整数）
- end_frame: 入力終了フレーム（省略時は1フレームのみ）
- buttons: 押しているボタンを列挙（例: →BA）
- 無入力: - または空欄
- コメント: # で始まる行は無視される
- フレーム指定は閉区間（10-12 は10〜12フレームに適用）

### 使用可能なボタン

- 方向キー: ←, →, ↑, ↓
- アクションボタン: A（ジャンプ）, B（ダッシュ／ファイア）

## 使用例

```typescript
// テキストフォーマットの解析
const parser = new TextFormatParser();
const inputFormat = parser.parse(textInput);

// ファミコン形式への変換
const nesMapper = new NesMapper();
const nesData = nesMapper.mapFromFormat(inputFormat);

// コンパイラの使用
const nesCompiler = new NesCompiler();
const compiledData = nesCompiler.compile(textInput);
const binary = nesCompiler.toBinary(compiledData);

// 可視化
console.log(FormatUtils.visualize(inputFormat));
```

## プロジェクト構成

```
/framepad
  /src
    /model       - データモデル（ボタン、フレーム、入力フォーマット）
    /parser      - テキストフォーマットパーサー
    /mappers     - 各ゲーム機向けマッパー
    /compilers   - 各形式間のコンパイラ
    /utils       - ユーティリティ（バリデーション、フォーマット）
  /tests         - テストファイル
  main.ts        - メインエントリーポイント
  main_test.ts   - テスト実行ファイル
```

## 実行方法

```bash
# メインプログラムの実行（サンプル入力の解析と変換）
deno run main.ts

# テストの実行
deno test
```

## 拡張性

このシステムは拡張性を考慮して設計されており、以下のような拡張が容易です：

1. 新しいゲーム機向けのマッパーの追加（SNES、メガドライブなど）
2. 異なる入力フォーマットのパーサーの追加
3. 新しい出力形式のコンパイラの実装

## 開発環境

- [Deno](https://deno.land/) - JavaScriptおよびTypeScriptランタイム
- TypeScript - 型安全な開発のための言語

## ライセンス

MITライセンス
