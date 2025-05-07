import { Button, ButtonCombination } from "./button.ts";
import { FrameInput } from "./frame.ts";

/**
 * フレーム単位の入力フォーマットを表すクラス
 */
export class InputFormat {
  private frameInputs: FrameInput[] = [];

  constructor(frameInputs: FrameInput[] = []) {
    this.frameInputs = [...frameInputs];
    // フレーム順にソート
    this.sortFrameInputs();
  }

  /**
   * フレーム入力を追加
   * @param frameInput 追加するフレーム入力
   */
  addFrameInput(frameInput: FrameInput): void {
    this.frameInputs.push(frameInput);
    this.sortFrameInputs();
  }

  /**
   * フレーム入力を削除
   * @param index 削除するフレーム入力のインデックス
   */
  removeFrameInput(index: number): void {
    if (index >= 0 && index < this.frameInputs.length) {
      this.frameInputs.splice(index, 1);
    }
  }

  /**
   * 全てのフレーム入力を取得
   * @returns フレーム入力の配列
   */
  getAllFrameInputs(): FrameInput[] {
    return [...this.frameInputs];
  }

  /**
   * 指定されたフレームでのボタン入力を取得
   * @param frame 取得するフレーム番号
   * @returns ボタンの組み合わせ（該当するフレーム入力がない場合は空の組み合わせ）
   */
  getButtonsAtFrame(frame: number): ButtonCombination {
    for (const frameInput of this.frameInputs) {
      if (frameInput.containsFrame(frame)) {
        return frameInput.buttons;
      }
    }
    return new ButtonCombination(); // 該当するフレーム入力がない場合は空の組み合わせ
  }

  /**
   * 最大のフレーム番号を取得
   * @returns 最大のフレーム番号
   */
  getMaxFrame(): number {
    if (this.frameInputs.length === 0) {
      return 0;
    }

    return Math.max(...this.frameInputs.map((input) => input.endFrame));
  }

  /**
   * フレーム入力をフレーム順にソート
   */
  private sortFrameInputs(): void {
    this.frameInputs.sort((a, b) => a.startFrame - b.startFrame);
  }

  /**
   * 入力フォーマットを文字列に変換
   * @returns フォーマットに従った文字列表現
   */
  toString(): string {
    if (this.frameInputs.length === 0) {
      return "";
    }

    return this.frameInputs.map((input) => input.toString()).join("\n");
  }
}
