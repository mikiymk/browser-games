type Arc = {
  readonly angle: number;
  readonly largeArc: 0 | 1;
  readonly rx: number;
  readonly ry: number;
  readonly sweep: 0 | 1;
  readonly type: "arc";
  readonly x: number;
  readonly y: number;
};
type Bezier = {
  readonly type: "bezier";
  readonly x: number;
  readonly x1: number;
  readonly x2: number;
  readonly y: number;
  readonly y1: number;
  readonly y2: number;
};
type Close = {
  readonly type: "close";
};
type Line = {
  readonly type: "line";
  readonly x: number;
  readonly y: number;
};
type Move = {
  readonly type: "move";
  readonly x: number;
  readonly y: number;
};
type Path = Arc | Bezier | Close | Line | Move;

/**
 * 絶対値のMoveToコマンド。
 * @param x X座標
 * @param y Y座標
 * @returns MoveToコマンドのパスオブジェクト
 */
export const move = (x: number, y: number): Move => {
  return { type: "move", x, y };
};

/**
 * 絶対値のLineToコマンド。
 * @param x X座標
 * @param y Y座標
 * @returns LineToコマンドのパスオブジェクト
 */
export const line = (x: number, y: number): Line => {
  return { type: "line", x, y };
};

/**
 * 絶対値の3次ベジェ曲線コマンド。
 * @param x1 開始制御点のX座標
 * @param y1 開始制御点のY座標
 * @param x2 終端制御点のX座標
 * @param y2 終端制御点のY座標
 * @param x 終了点のX座標
 * @param y 終了点のY座標
 * @returns 3次ベジェ曲線のパスオブジェクト
 */
export const bezier = (x1: number, y1: number, x2: number, y2: number, x: number, y: number): Bezier => {
  return {
    type: "bezier",
    x,
    x1,
    x2,
    y,
    y1,
    y2,
  };
};

/**
 * 絶対値の楕円円弧曲線コマンド。
 * @param rx 楕円のX半径
 * @param ry 楕円のY半径
 * @param angle 楕円の傾き
 * @param largeArc 大きい円弧フラグ
 * @param sweep 時計回りの円弧フラグ
 * @param x 終了点のX座標
 * @param y 終了点のY座標
 * @returns 楕円円弧曲線のパスオブジェクト
 */
export const arc = (
  rx: number,
  ry: number,
  angle: number,
  largeArc: 0 | 1,
  sweep: 0 | 1,
  x: number,
  y: number,
): Arc => {
  return {
    angle,
    largeArc,
    rx,
    ry,
    sweep,
    type: "arc",
    x,
    y,
  };
};

/**
 * パスを閉じるコマンド。
 * @returns パスを閉じるパスオブジェクト
 */
export const close = (): Close => {
  return { type: "close" };
};

type Previous = { readonly x: number; readonly y: number };
/** より短い文字列を返す */
const shorter = (a: string, b: string): string => (a.length < b.length ? a : b);

/**
 * SVGのパス文字列を生成する。
 * @param command コマンドオブジェクト
 * @param previous 前回の位置
 * @returns SVGパス文字列
 */
const moveToText = (command: Move, previous: Previous): string => {
  const { x, y } = command;

  return shorter(`M${x},${y}`, `m${x - previous.x},${y - previous.y}`);
};

/**
 * SVGのパス文字列を生成する。
 * @param command コマンドオブジェクト
 * @param previous 前回の位置
 * @returns SVGパス文字列
 */
const lineToText = (command: Line, previous: Previous): string => {
  const { x, y } = command;

  if (previous.x === x && previous.y === y) {
    return ""; // noop
  }

  if (previous.x === x) {
    return shorter(`V${y}`, `v${y - previous.y}`);
  }

  if (previous.y === y) {
    return shorter(`H${x}`, `h${x - previous.x}`);
  }

  return shorter(`L${x},${y}`, `l${x - previous.x},${y - previous.y}`);
};

/**
 * SVGのパス文字列を生成する。
 * @param command コマンドオブジェクト
 * @param previous 前回の位置
 * @returns SVGパス文字列
 */
const bezierToText = (command: Bezier, previous: Previous): string => {
  const absolute = `C${command.x1},${command.y1} ${command.x2},${command.y2} ${command.x},${command.y}`;
  const relative = `c${command.x1 - previous.x},${command.y1 - previous.y} ${command.x2 - previous.x},${command.y2 - previous.y} ${command.x - previous.x},${command.y - previous.y}`;

  return shorter(absolute, relative);
};

/**
 * SVGのパス文字列を生成する。
 * @param command コマンドオブジェクト
 * @param previous 前回の位置
 * @returns SVGパス文字列
 */
const arcToText = (command: Arc, previous: Previous): string => {
  const absolute = `A${command.rx},${command.ry} ${command.angle} ${command.largeArc} ${command.sweep} ${command.x},${command.y}`;
  const relative = `a${command.rx},${command.ry} ${command.angle} ${command.largeArc} ${command.sweep} ${command.x - previous.x},${command.y - previous.y}`;

  return shorter(absolute, relative);
};

/**
 * SVGのパスを生成する。
 * @param commands パスオブジェクトの配列
 * @returns パス文字列
 */
export const path = (...commands: readonly Path[]): string => {
  const previous = { x: 0, y: 0 };
  return commands
    .map((command) => {
      let commandText = "";

      switch (command.type) {
        case "arc": {
          commandText = arcToText(command, previous);
          break;
        }
        case "bezier": {
          commandText = bezierToText(command, previous);
          break;
        }
        case "close":
          return "Z";

        case "line": {
          commandText = lineToText(command, previous);
          break;
        }

        case "move": {
          commandText = moveToText(command, previous);
          break;
        }

        default:
          command satisfies never;
      }

      previous.x = command.x;
      previous.y = command.y;
      return commandText;
    })
    .join("");
};
