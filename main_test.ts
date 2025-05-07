// @ts-ignore: Denoの型定義が見つからない場合の対策
import { assertEquals, assertNotEquals } from "@std/assert";
import { Button, ButtonCombination } from "./src/model/button.ts";
import { FrameInput } from "./src/model/frame.ts";
import { InputFormat } from "./src/model/inputFormat.ts";
import { TextFormatParser } from "./src/parser/textFormatParser.ts";
import { NesMapper } from "./src/mappers/nesMapper.ts";
import type { NesInputData } from "./src/mappers/nesMapper.ts";
import { NesCompiler } from "./src/compilers/nesCompiler.ts";

// サンプル入力フォーマット
const sampleInput = `# テスト用入力
0-10: →B
11: →BA
12-20: →B
21-30: -`;

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("ButtonCombination - fromString", () => {
  const combo = ButtonCombination.fromString("→BA");

  assertEquals(combo.isPressed(Button.RIGHT), true);
  assertEquals(combo.isPressed(Button.A), true);
  assertEquals(combo.isPressed(Button.B), true);
  assertEquals(combo.isPressed(Button.LEFT), false);
  assertEquals(combo.isPressed(Button.UP), false);
  assertEquals(combo.isPressed(Button.DOWN), false);
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("ButtonCombination - toString", () => {
  const combo = new ButtonCombination([Button.RIGHT, Button.B, Button.A]);

  assertEquals(combo.toString(), "→BA");
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("FrameInput - constructor", () => {
  const buttons = new ButtonCombination([Button.RIGHT, Button.B]);
  const frame = new FrameInput(10, 20, buttons);

  assertEquals(frame.startFrame, 10);
  assertEquals(frame.endFrame, 20);
  assertEquals(frame.buttons, buttons);
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("FrameInput - containsFrame", () => {
  const buttons = new ButtonCombination([Button.RIGHT, Button.B]);
  const frame = new FrameInput(10, 20, buttons);

  assertEquals(frame.containsFrame(10), true);
  assertEquals(frame.containsFrame(15), true);
  assertEquals(frame.containsFrame(20), true);
  assertEquals(frame.containsFrame(9), false);
  assertEquals(frame.containsFrame(21), false);
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("FrameInput - getDuration", () => {
  const buttons = new ButtonCombination([Button.RIGHT, Button.B]);
  const frame = new FrameInput(10, 20, buttons);

  assertEquals(frame.getDuration(), 11); // 10から20まで（両端を含む）
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("InputFormat - addFrameInput", () => {
  const format = new InputFormat();
  const buttons = new ButtonCombination([Button.RIGHT, Button.B]);
  const frame = new FrameInput(10, 20, buttons);

  format.addFrameInput(frame);

  assertEquals(format.getAllFrameInputs().length, 1);
  assertEquals(format.getButtonsAtFrame(15).toString(), "→B");
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("TextFormatParser - parse", () => {
  const parser = new TextFormatParser();
  const format = parser.parse(sampleInput);

  assertEquals(format.getAllFrameInputs().length, 4);
  assertEquals(format.getButtonsAtFrame(5).toString(), "→B");
  assertEquals(format.getButtonsAtFrame(11).toString(), "→BA");
  assertEquals(format.getButtonsAtFrame(15).toString(), "→B");
  assertEquals(format.getButtonsAtFrame(25).toString(), "-");
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("NesMapper - mapFromFormat", () => {
  const parser = new TextFormatParser();
  const format = parser.parse(sampleInput);
  const mapper = new NesMapper();

  const nesData = mapper.mapFromFormat(format);

  assertEquals(nesData.frameInputs.length, 31); // 0から30までの各フレーム

  // フレーム0のボタン入力（→B）
  const frame0Buttons = nesData.frameInputs[0].buttons;
  assertNotEquals(frame0Buttons & 0x82, 0); // 0x82 = RIGHT(0x80) | B(0x02)

  // フレーム11のボタン入力（→BA）
  const frame11Buttons = nesData.frameInputs[11].buttons;
  assertNotEquals(frame11Buttons & 0x83, 0); // 0x83 = RIGHT(0x80) | B(0x02) | A(0x01)

  // フレーム25のボタン入力（無入力）
  const frame25Buttons = nesData.frameInputs[25].buttons;
  assertEquals(frame25Buttons, 0);
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("NesMapper - mapToFormat", () => {
  const parser = new TextFormatParser();
  const format = parser.parse(sampleInput);
  const mapper = new NesMapper();

  const nesData = mapper.mapFromFormat(format);
  const convertedFormat = mapper.mapToFormat(nesData);

  // 元のフォーマットと変換後のフォーマットで同じフレームの入力が一致するか確認
  for (let frame = 0; frame <= 30; frame++) {
    const originalButtons = format.getButtonsAtFrame(frame).toString();
    const convertedButtons = convertedFormat.getButtonsAtFrame(frame)
      .toString();

    assertEquals(
      convertedButtons,
      originalButtons,
      `フレーム ${frame} の入力が一致しません`,
    );
  }
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("NesCompiler - compile and decompile", () => {
  const compiler = new NesCompiler();

  const nesData = compiler.compile(sampleInput);
  const decompiled = compiler.decompile(nesData);

  // 元のテキストと逆コンパイル後のテキストを比較
  // 注: コメントは保持されないため、パースして比較
  const parser = new TextFormatParser();
  const originalFormat = parser.parse(sampleInput);
  const decompiledFormat = parser.parse(decompiled);

  // 両方のフォーマットで同じフレームの入力が一致するか確認
  for (let frame = 0; frame <= 30; frame++) {
    const originalButtons = originalFormat.getButtonsAtFrame(frame).toString();
    const decompiledButtons = decompiledFormat.getButtonsAtFrame(frame)
      .toString();

    assertEquals(
      decompiledButtons,
      originalButtons,
      `フレーム ${frame} の入力が一致しません`,
    );
  }
});

// @ts-ignore: Denoの型定義が見つからない場合の対策
Deno.test("NesCompiler - binary conversion", () => {
  const compiler = new NesCompiler();

  const nesData = compiler.compile(sampleInput);
  const binary = compiler.toBinary(nesData);
  const fromBinary = compiler.fromBinary(binary);

  // バイナリ変換前後でフレーム数が一致するか確認
  assertEquals(fromBinary.frameInputs.length, nesData.frameInputs.length);

  // バイナリ変換前後で各フレームの入力が一致するか確認
  for (let i = 0; i < nesData.frameInputs.length; i++) {
    const originalFrame = nesData.frameInputs[i].frame;
    const originalButtons = nesData.frameInputs[i].buttons;

    const convertedFrame = fromBinary.frameInputs[i].frame;
    const convertedButtons = fromBinary.frameInputs[i].buttons;

    assertEquals(
      convertedFrame,
      originalFrame,
      `フレーム番号が一致しません: ${originalFrame} vs ${convertedFrame}`,
    );
    assertEquals(
      convertedButtons,
      originalButtons,
      `ボタン入力が一致しません: ${originalButtons} vs ${convertedButtons}`,
    );
  }
});
