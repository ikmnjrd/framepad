import { Button, ButtonCombination } from "../model/button.ts";
import { FrameInput } from "../model/frame.ts";
import { InputFormat } from "../model/inputFormat.ts";

/**
 * 入力フォーマットのバリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 入力フォーマットのバリデーションを行うクラス
 */
export class InputValidator {
  /**
   * 入力フォーマットのバリデーションを実行
   * @param inputFormat バリデーションする入力フォーマット
   * @returns バリデーション結果
   */
  validate(inputFormat: InputFormat): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    const frameInputs = inputFormat.getAllFrameInputs();

    // フレーム入力が空の場合はエラー
    if (frameInputs.length === 0) {
      result.isValid = false;
      result.errors.push("フレーム入力が存在しません");
      return result;
    }

    // フレーム範囲の重複チェック
    this.checkFrameOverlap(frameInputs, result);

    // ボタン入力の矛盾チェック
    this.checkButtonConsistency(frameInputs, result);

    // フレーム番号の連続性チェック
    this.checkFrameContinuity(frameInputs, result);

    return result;
  }

  /**
   * フレーム範囲の重複をチェック
   * @param frameInputs フレーム入力の配列
   * @param result バリデーション結果
   */
  private checkFrameOverlap(
    frameInputs: FrameInput[],
    result: ValidationResult,
  ): void {
    for (let i = 0; i < frameInputs.length; i++) {
      const current = frameInputs[i];

      for (let j = i + 1; j < frameInputs.length; j++) {
        const other = frameInputs[j];

        // フレーム範囲が重複している場合
        if (
          current.startFrame <= other.endFrame &&
          other.startFrame <= current.endFrame
        ) {
          result.isValid = false;
          result.errors.push(
            `フレーム範囲が重複しています: ${current.toString()} と ${other.toString()}`,
          );
        }
      }
    }
  }

  /**
   * ボタン入力の矛盾をチェック
   * @param frameInputs フレーム入力の配列
   * @param result バリデーション結果
   */
  private checkButtonConsistency(
    frameInputs: FrameInput[],
    result: ValidationResult,
  ): void {
    for (const frameInput of frameInputs) {
      const buttons = frameInput.buttons;

      // 左右同時押しの警告
      if (buttons.isPressed(Button.LEFT) && buttons.isPressed(Button.RIGHT)) {
        result.warnings.push(
          `左右同時押しが指定されています: ${frameInput.toString()}`,
        );
      }

      // 上下同時押しの警告
      if (buttons.isPressed(Button.UP) && buttons.isPressed(Button.DOWN)) {
        result.warnings.push(
          `上下同時押しが指定されています: ${frameInput.toString()}`,
        );
      }
    }
  }

  /**
   * フレーム番号の連続性をチェック
   * @param frameInputs フレーム入力の配列
   * @param result バリデーション結果
   */
  private checkFrameContinuity(
    frameInputs: FrameInput[],
    result: ValidationResult,
  ): void {
    // フレーム順にソート済みと仮定
    for (let i = 1; i < frameInputs.length; i++) {
      const prev = frameInputs[i - 1];
      const current = frameInputs[i];

      // フレーム番号に隙間がある場合
      if (prev.endFrame + 1 < current.startFrame) {
        result.warnings.push(
          `フレーム ${prev.endFrame + 1} から ${
            current.startFrame - 1
          } までの入力が指定されていません`,
        );
      }
    }
  }
}
