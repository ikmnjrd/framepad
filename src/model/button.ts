/**
 * ボタンの種類を表す列挙型
 */
export enum Button {
  LEFT = "←",
  RIGHT = "→",
  UP = "↑",
  DOWN = "↓",
  A = "A",
  B = "B",
}

/**
 * ボタンの組み合わせを表すクラス
 */
export class ButtonCombination {
  private buttons: Set<Button>;

  constructor(buttons: Button[] = []) {
    this.buttons = new Set(buttons);
  }

  /**
   * ボタンが押されているかどうかを確認
   * @param button 確認するボタン
   * @returns ボタンが押されている場合はtrue
   */
  isPressed(button: Button): boolean {
    return this.buttons.has(button);
  }

  /**
   * ボタンを追加
   * @param button 追加するボタン
   */
  addButton(button: Button): void {
    this.buttons.add(button);
  }

  /**
   * ボタンを削除
   * @param button 削除するボタン
   */
  removeButton(button: Button): void {
    this.buttons.delete(button);
  }

  /**
   * 全てのボタンを取得
   * @returns ボタンの配列
   */
  getAllButtons(): Button[] {
    return Array.from(this.buttons);
  }

  /**
   * 文字列からボタンの組み合わせを作成
   * @param str ボタンを表す文字列（例: "→BA"）
   * @returns ボタンの組み合わせ
   */
  static fromString(str: string): ButtonCombination {
    const combination = new ButtonCombination();

    // 文字列の各文字をボタンとして解析
    for (const char of str) {
      switch (char) {
        case Button.LEFT:
          combination.addButton(Button.LEFT);
          break;
        case Button.RIGHT:
          combination.addButton(Button.RIGHT);
          break;
        case Button.UP:
          combination.addButton(Button.UP);
          break;
        case Button.DOWN:
          combination.addButton(Button.DOWN);
          break;
        case Button.A:
          combination.addButton(Button.A);
          break;
        case Button.B:
          combination.addButton(Button.B);
          break;
      }
    }

    return combination;
  }

  /**
   * ボタンの組み合わせを文字列に変換
   * @returns ボタンを表す文字列（例: "→BA"）
   */
  toString(): string {
    if (this.buttons.size === 0) {
      return "-"; // 無入力を表す
    }

    // 方向キー、アクションボタンの順に並べる
    const directionButtons = [
      Button.LEFT,
      Button.RIGHT,
      Button.UP,
      Button.DOWN,
    ];
    const actionButtons = [Button.B, Button.A]; // B, Aの順に並べる

    let result = "";

    // 方向キーを追加
    for (const button of directionButtons) {
      if (this.buttons.has(button)) {
        result += button;
      }
    }

    // アクションボタンを追加
    for (const button of actionButtons) {
      if (this.buttons.has(button)) {
        result += button;
      }
    }

    return result;
  }
}
