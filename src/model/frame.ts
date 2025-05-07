import { ButtonCombination } from "./button.ts";

/**
 * フレーム入力を表すクラス
 */
export class FrameInput {
  /**
   * @param startFrame 入力開始フレーム
   * @param endFrame 入力終了フレーム（省略時は開始フレームと同じ）
   * @param buttons ボタンの組み合わせ
   */
  constructor(
    public readonly startFrame: number,
    public readonly endFrame: number,
    public readonly buttons: ButtonCombination,
  ) {
    // endFrameが省略された場合や、startFrameより小さい場合は、startFrameと同じ値にする
    if (endFrame < startFrame) {
      this.endFrame = startFrame;
    }
  }

  /**
   * 指定されたフレームがこの入力範囲に含まれるかどうかを確認
   * @param frame 確認するフレーム番号
   * @returns 範囲内の場合はtrue
   */
  containsFrame(frame: number): boolean {
    return frame >= this.startFrame && frame <= this.endFrame;
  }

  /**
   * 入力の持続フレーム数を取得
   * @returns 持続フレーム数
   */
  getDuration(): number {
    return this.endFrame - this.startFrame + 1;
  }

  /**
   * フレーム入力を文字列に変換
   * @returns フォーマットに従った文字列表現
   */
  toString(): string {
    const frameRange = this.startFrame === this.endFrame
      ? `${this.startFrame}`
      : `${this.startFrame}-${this.endFrame}`;

    return `${frameRange}: ${this.buttons.toString()}`;
  }
}
