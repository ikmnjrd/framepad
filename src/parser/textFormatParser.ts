import { ButtonCombination } from "../model/button.ts";
import { FrameInput } from "../model/frame.ts";
import { InputFormat } from "../model/inputFormat.ts";

/**
 * テキストフォーマットのパーサー
 */
export class TextFormatParser {
  /**
   * テキストフォーマットを解析してInputFormatオブジェクトに変換
   * @param text 解析するテキスト
   * @returns 解析結果のInputFormatオブジェクト
   */
  parse(text: string): InputFormat {
    const inputFormat = new InputFormat();
    const lines = text.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 空行またはコメント行はスキップ
      if (trimmedLine === "" || trimmedLine.startsWith("#")) {
        continue;
      }

      try {
        const frameInput = this.parseFrameInputLine(trimmedLine);
        if (frameInput) {
          inputFormat.addFrameInput(frameInput);
        }
      } catch (error) {
        console.error(`行の解析に失敗しました: ${trimmedLine}`, error);
        // エラーが発生しても処理を続行
      }
    }

    return inputFormat;
  }

  /**
   * 1行のフレーム入力を解析
   * @param line 解析する行
   * @returns 解析結果のFrameInputオブジェクト
   */
  private parseFrameInputLine(line: string): FrameInput | null {
    // フォーマット: <start_frame>[-<end_frame>]: <buttons>
    const match = line.match(/^(\d+)(?:-(\d+))?:\s*(.*)$/);

    if (!match) {
      return null;
    }

    const startFrame = parseInt(match[1], 10);
    const endFrame = match[2] ? parseInt(match[2], 10) : startFrame;
    const buttonsStr = match[3].trim();

    // ボタンの解析
    let buttons: ButtonCombination;
    if (buttonsStr === "" || buttonsStr === "-") {
      // 無入力
      buttons = new ButtonCombination();
    } else {
      buttons = ButtonCombination.fromString(buttonsStr);
    }

    return new FrameInput(startFrame, endFrame, buttons);
  }

  /**
   * InputFormatオブジェクトをテキストフォーマットに変換
   * @param inputFormat 変換するInputFormatオブジェクト
   * @returns テキストフォーマット
   */
  stringify(inputFormat: InputFormat): string {
    return inputFormat.toString();
  }
}
