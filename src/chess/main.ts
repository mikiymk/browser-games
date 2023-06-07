// マスの状況
const Empty = -1;
const BlackPawn = 1;
const BlackKnight = 2;
const BlackBishop = 3;
const BlackRook = 4;
const BlackQueen = 5;
const BlackKing = 6;
const WhitePawn = 7;
const WhiteKnight = 8;
const WhiteBishop = 9;
const WhiteRook = 10;
const WhiteQueen = 11;
const WhiteKing = 12;

const Black = 13;
const White = 14;
const Reset = -2;

// 盤のサイズ
const BoardLength = 64;

const cells: HTMLElement[] = [];

let stat: HTMLElement;
let reset: HTMLElement;

// テンプレート要素
let templatePawn: HTMLTemplateElement;
let templateKnight: HTMLTemplateElement;
let templateBishop: HTMLTemplateElement;
let templateRook: HTMLTemplateElement;
let templateQueen: HTMLTemplateElement;
let templateKing: HTMLTemplateElement;

type Mark = typeof Black | typeof White;
type Piece =
  | typeof BlackPawn
  | typeof BlackKnight
  | typeof BlackBishop
  | typeof BlackRook
  | typeof BlackQueen
  | typeof BlackKing
  | typeof WhitePawn
  | typeof WhiteKnight
  | typeof WhiteBishop
  | typeof WhiteRook
  | typeof WhiteQueen
  | typeof WhiteKing;
type Empty = typeof Empty;

type Tuple<T, N, List extends T[] = []> = List["length"] extends N ? List : Tuple<T, N, [T, ...List]>;
type BoardData = Tuple<Piece | Empty, 64>;
// prettier-ignore
type Index = 
  | 0| 1| 2| 3| 4| 5| 6| 7
  | 8| 9|10|11|12|13|14|15
  |16|17|18|19|20|21|22|23
  |24|25|26|27|28|29|30|31
  |32|33|34|35|36|37|38|39
  |40|41|42|43|44|45|46|47
  |48|49|50|51|52|53|54|55
  |56|57|58|59|60|61|62|63;

type Awaitable<T> = T | Promise<T>;
interface Player {
  getMove(boardData: BoardData, mark: Mark): Awaitable<Index | typeof Reset>;
}

type Players = Record<Mark, Player>;

export const main = () => {
  const players = {
    [Black]: humanPlayer,
    [White]: humanPlayer,
  };

  // 要素を代入する
  for (let index = 0; index < BoardLength; index++) {
    const id = `chess-${index}`;
    const cell = element(id);
    cells.push(cell);
  }

  stat = element("chess-stat");
  reset = element("chess-reset");
  templatePawn = element("chess-temp-pawn") as HTMLTemplateElement;
  templateKnight = element("chess-temp-knight") as HTMLTemplateElement;
  templateBishop = element("chess-temp-bishop") as HTMLTemplateElement;
  templateRook = element("chess-temp-rook") as HTMLTemplateElement;
  templateQueen = element("chess-temp-queen") as HTMLTemplateElement;
  templateKing = element("chess-temp-king") as HTMLTemplateElement;

  const settings = element("chess-settings") as HTMLDialogElement;
  const openSettings = element("chess-open-settings");
  const closeSettings = element("chess-close-settings");
  const playerBlack = element("chess-player-black") as HTMLInputElement;
  const playerWhite = element("chess-player-white") as HTMLInputElement;

  openSettings.addEventListener("click", () => {
    settings.showModal();
  });

  closeSettings.addEventListener("click", () => {
    settings.close();
  });

  playerBlack.addEventListener("change", (event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    console.log(`black player changes to ${value}`);
    if (value === "human") {
      players[Black] = humanPlayer;
    } else if (value === "ai") {
      players[Black] = aiPlayer;
    }
  });

  playerWhite.addEventListener("change", (event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    console.log(`white player changes to ${value}`);
    if (value === "human") {
      players[White] = humanPlayer;
    } else if (value === "ai") {
      players[White] = aiPlayer;
    }
  });

  playerBlack.value = "human";
  playerWhite.value = "ai";

  for (let index = 0; index < BoardLength; index++) {
    const cell = cells[index];

    const onClick = () => {
      console.log(`clicks ${index} cell`);
      humanPlayer.resolve(index);
    };

    cell.addEventListener("click", onClick);
  }

  const onReset = () => {
    console.log("reset games");
    humanPlayer.resolve(Reset);

    void gameLoop(players);
  };

  reset.addEventListener("click", onReset);

  void gameLoop(players);
};

const gameLoop = async (players: Players) => {
  let mark: Mark = White;
  const boardData = Array.from<Piece | Empty>({ length: BoardLength }).fill(Empty) as BoardData;
  initializeBoard(boardData);

  setBoard(boardData);
  console.log("start game");

  for (;;) {
    const player = players[mark];

    stat.textContent = mark === Black ? "Black turn" : "White turn";

    const move = await player.getMove(boardData, mark);

    if (move.type === Reset) {
      break;
    }

    doAction(boardData, mark, move);

    mark = invertMark(mark);

    setBoard(boardData);

    if (isFinished(boardData)) {
      break;
    }
  }

  console.log("end game");
};

const initializeBoard = (boardData: BoardData) => {
  boardData.fill(Empty);

  boardData[0] = BlackRook;
  boardData[1] = BlackKnight;
  boardData[2] = BlackBishop;
  boardData[3] = BlackQueen;
  boardData[4] = BlackKing;
  boardData[5] = BlackBishop;
  boardData[6] = BlackKnight;
  boardData[7] = BlackRook;

  boardData[8] = BlackPawn;
  boardData[9] = BlackPawn;
  boardData[10] = BlackPawn;
  boardData[11] = BlackPawn;
  boardData[12] = BlackPawn;
  boardData[13] = BlackPawn;
  boardData[14] = BlackPawn;
  boardData[15] = BlackPawn;

  boardData[48] = WhitePawn;
  boardData[49] = WhitePawn;
  boardData[50] = WhitePawn;
  boardData[51] = WhitePawn;
  boardData[52] = WhitePawn;
  boardData[53] = WhitePawn;
  boardData[54] = WhitePawn;
  boardData[55] = WhitePawn;

  boardData[56] = WhiteRook;
  boardData[57] = WhiteKnight;
  boardData[58] = WhiteBishop;
  boardData[59] = WhiteQueen;
  boardData[60] = WhiteKing;
  boardData[61] = WhiteBishop;
  boardData[62] = WhiteKnight;
  boardData[63] = WhiteRook;
};

const setBoard = (boardData: BoardData) => {
  for (let index = 0; index < BoardLength; index++) {
    const data = boardData[index];
    let temporaryElement, color;

    switch (data) {
      case WhitePawn:
      case BlackPawn: {
        temporaryElement = templatePawn;

        break;
      }
      case WhiteKnight:
      case BlackKnight: {
        temporaryElement = templateKnight;

        break;
      }
      case WhiteBishop:
      case BlackBishop: {
        temporaryElement = templateBishop;

        break;
      }
      case WhiteRook:
      case BlackRook: {
        temporaryElement = templateRook;

        break;
      }
      case WhiteQueen:
      case BlackQueen: {
        temporaryElement = templateQueen;

        break;
      }
      case WhiteKing:
      case BlackKing: {
        temporaryElement = templateKing;

        break;
      }
      // No default
    }

    const mark = getPieceMark(data);
    if (mark === White) {
      color = "white";
    } else if (mark === Black) {
      color = "black";
    }

    const cell = cells[index];
    while (cell.firstChild) cell.lastChild.remove();

    if (temporaryElement !== undefined) {
      const element_ = document.createElement("span");
      element_.className = `piece-${color}`;
      element_.append(temporaryElement.content.cloneNode(true));

      cell.append(element_);
    }
  }
};

const getPieceMark = (piece: Piece | Empty) => {
  if (
    piece === WhitePawn ||
    piece === WhiteKnight ||
    piece === WhiteBishop ||
    piece === WhiteRook ||
    piece === WhiteQueen ||
    piece === WhiteKing
  ) {
    return White;
  } else if (
    piece === BlackPawn ||
    piece === BlackKnight ||
    piece === BlackBishop ||
    piece === BlackRook ||
    piece === BlackQueen ||
    piece === BlackKing
  ) {
    return Black;
  }

  return Empty;
};

const doAction = (boardData: BoardData, mark: Mark, action: Action) => {
  if (action.type === "move") {
    boardData[action.moveTo] = boardData[action.moveFrom];
    boardData[action.moveFrom] = Empty;
  }
};

const invertMark = (mark: Mark): Mark => {
  if (mark === Black) {
    return White;
  } else if (mark === White) {
    return Black;
  }
};

const isFinished = (boardData: BoardData) => {
  // todo
  return false;
};

const getMovable = (boardData: BoardData, from: Index) => {
  const fromPiece = boardData[from];
  const fromPieceMark = getPieceMark(fromPiece);
  const foreDirection = fromPieceMark === White ? -1 : 1;
  const movables = [];

  switch (fromPiece) {
    case WhitePawn:
    case BlackPawn: {
      const to = validateMove(from, foreDirection, 0);
      if (to !== undefined && getPieceMark(boardData[to]) === Empty) {
        movables.push(to);

        if (
          (fromPiece === WhitePawn && 48 <= from && from <= 55) ||
          (fromPiece === BlackPawn && 8 <= from && from <= 15)
        ) {
          const to = validateMove(from, foreDirection * 2, 0);

          if (to !== undefined && getPieceMark(boardData[to]) === Empty) {
            movables.push(to);
          }
        }
      }

      // capturing
      for (const index of [-1, 1]) {
        const to = validateMove(from, foreDirection, index);

        if (to !== undefined && getPieceMark(boardData[to]) === invertMark(fromPieceMark)) {
          movables.push(to);
        }
      }

      break;
    }
    case WhiteKnight:
    case BlackKnight: {
      for (const [x, y] of [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ]) {
        const to = validateMove(from, x, y);

        if (to !== undefined) {
          movables.push(to);
        }
      }

      break;
    }
    case WhiteBishop:
    case BlackBishop: {
      for (const [dx, dy] of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        let x = 0;
        let y = 0;

        while (true) {
          x += dx;
          y += dy;
          const to = validateMove(from, x, y);

          if (to === undefined) break;
          if (isSameMark(boardData, from, to)) break;

          movables.push(to);

          if (isOtherMark(boardData, from, to)) break;
        }
      }

      break;
    }
    case WhiteRook:
    case BlackRook: {
      for (const [dx, dy] of [
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
      ]) {
        let x = 0;
        let y = 0;

        while (true) {
          x += dx;
          y += dy;
          const to = validateMove(from, x, y);

          if (to === undefined) break;
          if (isSameMark(boardData, from, to)) break;

          movables.push(to);

          if (isOtherMark(boardData, from, to)) break;
        }
      }

      break;
    }
    case WhiteQueen:
    case BlackQueen: {
      for (const [dx, dy] of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
      ]) {
        let x = 0;
        let y = 0;

        while (true) {
          x += dx;
          y += dy;
          const to = validateMove(from, x, y);

          if (to === undefined) break;
          if (isSameMark(boardData, from, to)) break;

          movables.push(to);

          if (isOtherMark(boardData, from, to)) break;
        }
      }

      break;
    }
    case WhiteKing:
    case BlackKing: {
      for (const [x, y] of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [0, -1],
        [0, 1],
        [1, 0],
        [-1, 0],
      ]) {
        const to = validateMove(from, x, y);

        if (to === undefined) continue;
        if (isSameMark(boardData, from, to)) continue;

        movables.push(to);
      }

      break;
    }
    // No default
  }

  return movables;
};

const validateMove = (from: Index, x: number, y: number): Index | undefined => {
  const to = (from + x * 8 + y) as Index;

  // 縦を飛び出した場合
  if (to < 0 || 63 < to) return;

  // 横を飛び出した場合
  const moveHorizon = from + y;
  if (from - (from % 8) !== moveHorizon - (moveHorizon % 8)) {
    return;
  }

  return to;
};

const isSameMark = (boardData: BoardData, from: Index, to: Index) => {
  const fromPiece = boardData[from];
  const toPiece = boardData[to];

  return getPieceMark(fromPiece) === getPieceMark(toPiece);
};

const isOtherMark = (boardData: BoardData, from: Index, to: Index) => {
  const fromPieceMark = getPieceMark(boardData[from]);
  const toPieceMark = getPieceMark(boardData[to]);

  return (fromPieceMark === Black && toPieceMark === White) || (fromPieceMark === White && toPieceMark === Black);
};

const humanPlayer = {
  promise: new Promise(() => {}),

  reset() {
    humanPlayer.promise = new Promise((resolve) => {
      humanPlayer.resolve = resolve;
    });
  },

  resolve: () => {},

  async getMove(boardData: BoardData, mark: Mark) {
    let moveFrom;

    while (moveFrom === undefined) {
      humanPlayer.reset();
      const clicked = await humanPlayer.promise;

      if (clicked === Reset) {
        return { type: Reset };
      }

      if (getPieceMark(boardData[clicked]) === mark) {
        moveFrom = clicked;
      }
    }

    const movableIndeces = getMovable(boardData, moveFrom);

    cells[moveFrom].classList.add("selected");

    for (const index of movableIndeces) {
      cells[index].classList.add("movable");
    }

    let moveTo;

    while (moveTo === undefined) {
      humanPlayer.reset();
      const clicked = await humanPlayer.promise;

      if (clicked === Reset) {
        return { type: Reset };
      }

      if (getPieceMark(boardData[clicked]) !== mark) {
        moveTo = clicked;
      }
    }

    cells[moveFrom].classList.remove("selected");

    for (const index of movableIndeces) {
      cells[index].classList.remove("movable");
    }

    return { type: "move", moveFrom, moveTo };
  },
};

/**
 * IDから要素を取得する関数
 * @param {string} id
 * @returns {HTMLElement}
 */
const element = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, unicorn/prefer-query-selector
  return document.getElementById(id)!;
};
