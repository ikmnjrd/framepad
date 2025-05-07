import { InputFormat } from "../model/inputFormat.ts";

/**
 * マッパーのインターフェース
 * 各ゲームシステム向けのマッパーはこのインターフェースを実装する
 */
export interface Mapper {
  /**
   * マッパーの名前を取得
   * @returns マッパーの名前
   */
  getName(): string;

  /**
   * 入力フォーマットをシステム固有の形式に変換
   * @param inputFormat 変換する入力フォーマット
   * @returns システム固有の形式のデータ（実装によって型は異なる）
   */
  mapFromFormat(inputFormat: InputFormat): unknown;

  /**
   * システム固有の形式から入力フォーマットに変換
   * @param data システム固有の形式のデータ
   * @returns 変換された入力フォーマット
   */
  mapToFormat(data: unknown): InputFormat;
}
