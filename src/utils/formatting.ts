import { Button, ButtonCombination } from "../model/button.ts";
import { FrameInput } from "../model/frame.ts";
import { InputFormat } from "../model/inputFormat.ts";

/**
 * フォーマット関連のユーティリティクラス
 */
export class FormatUtils {
  /**
   * 入力フォーマットを整形して出力
   * @param inputFormat 整形する入力フォーマット
   * @param includeHeader ヘッダーを含めるかどうか
   * @returns 整形されたテキスト
   */
  static formatInputFormat(
    inputFormat: InputFormat,
    includeHeader = true,
  ): string {
    const lines: string[] = [];

    if (includeHeader) {
      lines.push("# プレイ指示フォーマット");
      lines.push("");
    }

    const frameInputs = inputFormat.getAllFrameInputs();

    for (const frameInput of frameInputs) {
      lines.push(frameInput.toString());
    }

    return lines.join("\n");
  }

  /**
   * 入力フォーマットをCSV形式に変換
   * @param inputFormat 変換する入力フォーマット
   * @param includeHeader ヘッダー行を含めるかどうか
   * @returns CSV形式のテキスト
   */
  static toCSV(inputFormat: InputFormat, includeHeader = true): string {
    const lines: string[] = [];

    if (includeHeader) {
      lines.push("start_frame,end_frame,buttons");
    }

    const frameInputs = inputFormat.getAllFrameInputs();

    for (const frameInput of frameInputs) {
      const buttonsStr = frameInput.buttons.toString();
      lines.push(
        `${frameInput.startFrame},${frameInput.endFrame},${buttonsStr}`,
      );
    }

    return lines.join("\n");
  }

  /**
   * 入力フォーマットをJSON形式に変換
   * @param inputFormat 変換する入力フォーマット
   * @param pretty 整形するかどうか
   * @returns JSON形式のテキスト
   */
  static toJSON(inputFormat: InputFormat, pretty = true): string {
    const frameInputs = inputFormat.getAllFrameInputs();

    const jsonObj = {
      frameInputs: frameInputs.map((input) => ({
        startFrame: input.startFrame,
        endFrame: input.endFrame,
        buttons: input.buttons.toString(),
      })),
    };

    return pretty ? JSON.stringify(jsonObj, null, 2) : JSON.stringify(jsonObj);
  }

  /**
   * 入力フォーマットを可視化したテキストに変換
   * @param inputFormat 変換する入力フォーマット
   * @param maxFrame 表示する最大フレーム数（デフォルトは入力の最大フレーム）
   * @returns 可視化されたテキスト
   */
  static visualize(inputFormat: InputFormat, maxFrame?: number): string {
    const actualMaxFrame = maxFrame ?? inputFormat.getMaxFrame();
    const lines: string[] = [];

    // ヘッダー行
    let header = "フレーム | ";
    const buttonTypes = [
      Button.LEFT,
      Button.RIGHT,
      Button.UP,
      Button.DOWN,
      Button.A,
      Button.B,
    ];

    for (const button of buttonTypes) {
      header += `${button} `;
    }

    lines.push(header);
    lines.push("-".repeat(header.length));

    // 各フレームの入力状態
    for (let frame = 0; frame <= actualMaxFrame; frame++) {
      const buttons = inputFormat.getButtonsAtFrame(frame);
      let line = `${frame.toString().padStart(6)} | `;

      for (const button of buttonTypes) {
        line += buttons.isPressed(button) ? "○ " : "- ";
      }

      lines.push(line);
    }

    return lines.join("\n");
  }
}
