/**
 * コンパイラのインターフェース
 * 各フォーマット間の変換を行うコンパイラはこのインターフェースを実装する
 */
export interface Compiler<SourceType, TargetType> {
  /**
   * コンパイラの名前を取得
   * @returns コンパイラの名前
   */
  getName(): string;

  /**
   * ソース形式からターゲット形式にコンパイル
   * @param source ソース形式のデータ
   * @returns ターゲット形式のデータ
   */
  compile(source: SourceType): TargetType;

  /**
   * ターゲット形式からソース形式に逆コンパイル
   * @param target ターゲット形式のデータ
   * @returns ソース形式のデータ
   */
  decompile(target: TargetType): SourceType;
}
