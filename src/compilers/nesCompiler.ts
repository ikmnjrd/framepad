import { InputFormat } from "../model/inputFormat.ts";
import { NesMapper } from "../mappers/nesMapper.ts";
import type { NesInputData } from "../mappers/nesMapper.ts";
import { TextFormatParser } from "../parser/textFormatParser.ts";
import { Compiler } from "./compilerInterface.ts";

/**
 * テキストフォーマットとNES形式の間の変換を行うコンパイラ
 */
export class NesCompiler implements Compiler<string, NesInputData> {
  private parser: TextFormatParser;
  private mapper: NesMapper;

  constructor() {
    this.parser = new TextFormatParser();
    this.mapper = new NesMapper();
  }

  getName(): string {
    return "ファミコン（NES）コンパイラ";
  }

  /**
   * テキストフォーマットからNES形式にコンパイル
   * @param source テキストフォーマット
   * @returns NES形式の入力データ
   */
  compile(source: string): NesInputData {
    // テキストフォーマットを解析してInputFormatに変換
    const inputFormat = this.parser.parse(source);

    // InputFormatをNES形式に変換
    return this.mapper.mapFromFormat(inputFormat);
  }

  /**
   * NES形式からテキストフォーマットに逆コンパイル
   * @param target NES形式の入力データ
   * @returns テキストフォーマット
   */
  decompile(target: NesInputData): string {
    // NES形式からInputFormatに変換
    const inputFormat = this.mapper.mapToFormat(target);

    // InputFormatをテキストフォーマットに変換
    return this.parser.stringify(inputFormat);
  }

  /**
   * NES形式のデータをバイナリ形式に変換
   * @param data NES形式の入力データ
   * @returns バイナリデータ（Uint8Array）
   */
  toBinary(data: NesInputData): Uint8Array {
    // フレーム数を計算
    const frameCount = data.frameInputs.length;

    // ヘッダー（4バイト）+ フレームデータ（1フレームあたり5バイト）
    const bufferSize = 4 + (frameCount * 5);
    const buffer = new Uint8Array(bufferSize);

    // ヘッダー: "NES" + バージョン
    buffer[0] = 0x4E; // 'N'
    buffer[1] = 0x45; // 'E'
    buffer[2] = 0x53; // 'S'
    buffer[3] = 0x01; // バージョン1

    // フレームデータ
    for (let i = 0; i < frameCount; i++) {
      const frameInput = data.frameInputs[i];
      const offset = 4 + (i * 5);

      // フレーム番号（4バイト）
      buffer[offset] = (frameInput.frame >> 24) & 0xFF;
      buffer[offset + 1] = (frameInput.frame >> 16) & 0xFF;
      buffer[offset + 2] = (frameInput.frame >> 8) & 0xFF;
      buffer[offset + 3] = frameInput.frame & 0xFF;

      // ボタン入力（1バイト）
      buffer[offset + 4] = frameInput.buttons & 0xFF;
    }

    return buffer;
  }

  /**
   * バイナリデータからNES形式のデータに変換
   * @param binary バイナリデータ
   * @returns NES形式の入力データ
   */
  fromBinary(binary: Uint8Array): NesInputData {
    const data: NesInputData = {
      frameInputs: [],
    };

    // ヘッダーチェック
    if (
      binary.length < 4 ||
      binary[0] !== 0x4E || // 'N'
      binary[1] !== 0x45 || // 'E'
      binary[2] !== 0x53
    ) { // 'S'
      throw new Error("無効なNESバイナリデータです");
    }

    // バージョンチェック
    if (binary[3] !== 0x01) {
      throw new Error(`サポートされていないバージョンです: ${binary[3]}`);
    }

    // フレームデータの解析
    const frameCount = (binary.length - 4) / 5;

    for (let i = 0; i < frameCount; i++) {
      const offset = 4 + (i * 5);

      // フレーム番号（4バイト）
      const frame = (binary[offset] << 24) |
        (binary[offset + 1] << 16) |
        (binary[offset + 2] << 8) |
        binary[offset + 3];

      // ボタン入力（1バイト）
      const buttons = binary[offset + 4];

      data.frameInputs.push({ frame, buttons });
    }

    return data;
  }
}
