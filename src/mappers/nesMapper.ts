import { Button, ButtonCombination } from "../model/button.ts";
import { FrameInput } from "../model/frame.ts";
import { InputFormat } from "../model/inputFormat.ts";
import { Mapper } from "./mapperInterface.ts";

/**
 * ファミコン（NES）のボタン定義
 */
export enum NesButton {
  A = 0x01, // 00000001
  B = 0x02, // 00000010
  SELECT = 0x04, // 00000100
  START = 0x08, // 00001000
  UP = 0x10, // 00010000
  DOWN = 0x20, // 00100000
  LEFT = 0x40, // 01000000
  RIGHT = 0x80, // 10000000
}

/**
 * ファミコン（NES）のフレーム入力
 */
export interface NesFrameInput {
  frame: number;
  buttons: number; // ビットフラグでボタン入力を表現
}

/**
 * ファミコン（NES）の入力データ
 */
export interface NesInputData {
  frameInputs: NesFrameInput[];
}

/**
 * ファミコン（NES）用のマッパー
 */
export class NesMapper implements Mapper {
  getName(): string {
    return "ファミコン（NES）";
  }

  /**
   * 入力フォーマットをNES形式に変換
   * @param inputFormat 変換する入力フォーマット
   * @returns NES形式の入力データ
   */
  mapFromFormat(inputFormat: InputFormat): NesInputData {
    const nesInputData: NesInputData = {
      frameInputs: [],
    };

    // 最大フレーム数を取得
    const maxFrame = inputFormat.getMaxFrame();

    // 各フレームの入力を変換
    for (let frame = 0; frame <= maxFrame; frame++) {
      const buttons = inputFormat.getButtonsAtFrame(frame);
      const nesButtons = this.convertToNesButtons(buttons);

      nesInputData.frameInputs.push({
        frame,
        buttons: nesButtons,
      });
    }

    return nesInputData;
  }

  /**
   * NES形式から入力フォーマットに変換
   * @param data NES形式の入力データ
   * @returns 変換された入力フォーマット
   */
  mapToFormat(data: unknown): InputFormat {
    const nesData = data as NesInputData;
    const inputFormat = new InputFormat();

    if (!nesData || !nesData.frameInputs) {
      return inputFormat;
    }

    // 連続した同じ入力をまとめる
    let currentButtons = -1;
    let startFrame = 0;

    for (let i = 0; i < nesData.frameInputs.length; i++) {
      const { frame, buttons } = nesData.frameInputs[i];

      if (buttons !== currentButtons) {
        // 前の入力があれば追加
        if (currentButtons !== -1 && i > 0) {
          const endFrame = nesData.frameInputs[i - 1].frame;
          const buttonCombination = this.convertFromNesButtons(currentButtons);
          inputFormat.addFrameInput(
            new FrameInput(startFrame, endFrame, buttonCombination),
          );
        }

        // 新しい入力の開始
        currentButtons = buttons;
        startFrame = frame;
      }
    }

    // 最後の入力を追加
    if (currentButtons !== -1 && nesData.frameInputs.length > 0) {
      const endFrame =
        nesData.frameInputs[nesData.frameInputs.length - 1].frame;
      const buttonCombination = this.convertFromNesButtons(currentButtons);
      inputFormat.addFrameInput(
        new FrameInput(startFrame, endFrame, buttonCombination),
      );
    }

    return inputFormat;
  }

  /**
   * ボタンの組み合わせをNESボタンのビットフラグに変換
   * @param buttons ボタンの組み合わせ
   * @returns NESボタンのビットフラグ
   */
  private convertToNesButtons(buttons: ButtonCombination): number {
    let nesButtons = 0;

    if (buttons.isPressed(Button.A)) {
      nesButtons |= NesButton.A;
    }
    if (buttons.isPressed(Button.B)) {
      nesButtons |= NesButton.B;
    }
    if (buttons.isPressed(Button.UP)) {
      nesButtons |= NesButton.UP;
    }
    if (buttons.isPressed(Button.DOWN)) {
      nesButtons |= NesButton.DOWN;
    }
    if (buttons.isPressed(Button.LEFT)) {
      nesButtons |= NesButton.LEFT;
    }
    if (buttons.isPressed(Button.RIGHT)) {
      nesButtons |= NesButton.RIGHT;
    }

    return nesButtons;
  }

  /**
   * NESボタンのビットフラグからボタンの組み合わせに変換
   * @param nesButtons NESボタンのビットフラグ
   * @returns ボタンの組み合わせ
   */
  private convertFromNesButtons(nesButtons: number): ButtonCombination {
    const buttons: Button[] = [];

    if (nesButtons & NesButton.A) {
      buttons.push(Button.A);
    }
    if (nesButtons & NesButton.B) {
      buttons.push(Button.B);
    }
    if (nesButtons & NesButton.UP) {
      buttons.push(Button.UP);
    }
    if (nesButtons & NesButton.DOWN) {
      buttons.push(Button.DOWN);
    }
    if (nesButtons & NesButton.LEFT) {
      buttons.push(Button.LEFT);
    }
    if (nesButtons & NesButton.RIGHT) {
      buttons.push(Button.RIGHT);
    }

    return new ButtonCombination(buttons);
  }
}
