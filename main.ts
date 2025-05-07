import { ButtonCombination } from "./src/model/button.ts";
import { FrameInput } from "./src/model/frame.ts";
import { InputFormat } from "./src/model/inputFormat.ts";
import { TextFormatParser } from "./src/parser/textFormatParser.ts";
import { NesMapper } from "./src/mappers/nesMapper.ts";
import { NesCompiler } from "./src/compilers/nesCompiler.ts";
import { InputValidator } from "./src/utils/validation.ts";
import { FormatUtils } from "./src/utils/formatting.ts";

// 型のインポート
import type { NesInputData } from "./src/mappers/nesMapper.ts";

/**
 * サンプル入力フォーマット
 */
const sampleInput = `# 開始直後、右にダッシュ
0-59: →B

# ジャンプ開始（60フレーム目）
60: →BA

# ジャンプ継続（Aボタンを離すなら→B）
61-100: →B

# 着地して静止
101-120: -`;

/**
 * メイン処理
 */
function main() {
  console.log("=== FramePad: ゲーム入力フォーマットパーサーとマッパー ===\n");

  // テキストフォーマットの解析
  console.log("【テキストフォーマットの解析】");
  const parser = new TextFormatParser();
  const inputFormat = parser.parse(sampleInput);
  console.log("解析結果:");
  console.log(inputFormat.toString());
  console.log();

  // バリデーション
  console.log("【バリデーション】");
  const validator = new InputValidator();
  const validationResult = validator.validate(inputFormat);
  console.log(`有効: ${validationResult.isValid}`);

  if (validationResult.errors.length > 0) {
    console.log("エラー:");
    for (const error of validationResult.errors) {
      console.log(`- ${error}`);
    }
  }

  if (validationResult.warnings.length > 0) {
    console.log("警告:");
    for (const warning of validationResult.warnings) {
      console.log(`- ${warning}`);
    }
  }
  console.log();

  // ファミコン（NES）形式への変換
  console.log("【ファミコン（NES）形式への変換】");
  const nesMapper = new NesMapper();
  const nesData = nesMapper.mapFromFormat(inputFormat);
  console.log("NESデータ:");
  console.log(JSON.stringify(nesData, null, 2));
  console.log();

  // ファミコン（NES）形式からの変換
  console.log("【ファミコン（NES）形式からの変換】");
  const convertedFormat = nesMapper.mapToFormat(nesData);
  console.log("変換結果:");
  console.log(convertedFormat.toString());
  console.log();

  // コンパイラの使用
  console.log("【コンパイラの使用】");
  const nesCompiler = new NesCompiler();

  // テキストからNES形式へコンパイル
  const compiledData = nesCompiler.compile(sampleInput);
  console.log("コンパイル結果:");
  console.log(JSON.stringify(compiledData, null, 2));
  console.log();

  // NES形式からテキストへ逆コンパイル
  const decompiled = nesCompiler.decompile(compiledData);
  console.log("逆コンパイル結果:");
  console.log(decompiled);
  console.log();

  // バイナリ変換
  console.log("【バイナリ変換】");
  const binary = nesCompiler.toBinary(compiledData);
  console.log(`バイナリサイズ: ${binary.length} バイト`);
  console.log(
    `バイナリヘッダー: ${
      Array.from(binary.slice(0, 4)).map((b) => b.toString(16).padStart(2, "0"))
        .join(" ")
    }`,
  );
  console.log();

  // フォーマットユーティリティ
  console.log("【フォーマットユーティリティ】");

  // CSV形式
  console.log("CSV形式:");
  console.log(FormatUtils.toCSV(inputFormat));
  console.log();

  // JSON形式
  console.log("JSON形式:");
  console.log(FormatUtils.toJSON(inputFormat));
  console.log();

  // 可視化
  console.log("可視化:");
  console.log(FormatUtils.visualize(inputFormat, 10)); // 最初の10フレームのみ表示
  console.log();

  console.log("=== 処理完了 ===");
}

// メイン処理の実行
// Denoでは、直接実行された場合のみメイン処理を実行
// @ts-ignore: Denoの型定義が見つからない場合の対策
if (typeof Deno !== "undefined" && Deno.args !== undefined) {
  main();
}

// モジュールとしてエクスポート
export {
  ButtonCombination,
  FormatUtils,
  FrameInput,
  InputFormat,
  InputValidator,
  NesCompiler,
  NesMapper,
  TextFormatParser,
};

// 型のエクスポート
export type { NesInputData };
