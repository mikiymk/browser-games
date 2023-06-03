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

/**
 * マス目要素のリスト
 * @type {HTMLElement[]}
 */
const cells = [];
/**
 * 状況テキスト要素
 * @type {HTMLElement}
 */
let stat;
/**
 * リセットボタン要素
 * @type {HTMLElement}
 */
let reset;

// テンプレート要素
/** @type {HTMLTemplateElement} */
let templatePawn;
/** @type {HTMLTemplateElement} */
let templateKnight;
/** @type {HTMLTemplateElement} */
let templateBishop;
/** @type {HTMLTemplateElement} */
let templateRook;
/** @type {HTMLTemplateElement} */
let templateQueen;
/** @type {HTMLTemplateElement} */
let templateKing;

export const main = () => {
  const players = {
    [Black]: humanPlayer,
    [White]: humanPlayer,
  };

  // 要素を代入する
  for (let i = 0; i < BoardLength; i++) {
    const id = `chess-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  stat = elem("chess-stat");
  reset = elem("chess-reset");
  templatePawn = elem("chess-temp-pawn");
  templateKnight = elem("chess-temp-knight");
  templateBishop = elem("chess-temp-bishop");
  templateRook = elem("chess-temp-rook");
  templateQueen = elem("chess-temp-queen");
  templateKing = elem("chess-temp-king");

  const settings = elem("chess-settings");
  const openSettings = elem("chess-open-settings");
  const closeSettings = elem("chess-close-settings");
  const playerBlack = elem("chess-player-black");
  const playerWhite = elem("chess-player-white");

  openSettings.addEventListener("click", () => {
    settings.showModal();
  });

  closeSettings.addEventListener("click", () => {
    settings.close();
  });

  playerBlack.addEventListener("change", (event) => {
    const value = event.currentTarget.value;
    console.log(`black player changes to ${value}`);
    if (value === "human") {
      players[Black] = humanPlayer;
    } else if (value === "ai") {
      players[Black] = aiPlayer;
    }
  });

  playerWhite.addEventListener("change", (event) => {
    const value = event.currentTarget.value;
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

    gameLoop(players);
  };

  reset.addEventListener("click", onReset);

  gameLoop(players);
};

const gameLoop = async (players) => {
  let mark = White;
  const boardData = Array(BoardLength);
  initializeBoard(boardData);

  setBoard(boardData);

  while (true) {
    const player = players[mark];

    stat.innerText = mark === Black ? "Black turn" : "White turn";

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
};

/**
 * @param {number[]} boardData
 */
const initializeBoard = (boardData) => {
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

/**
 * @param {number[]} boardData
 */
const setBoard = (boardData) => {
  for (let i = 0; i < BoardLength; i++) {
    const data = boardData[i];
    let tempElem, color;

    if (data === WhitePawn || data === BlackPawn) {
      tempElem = templatePawn;
    } else if (data === WhiteKnight || data === BlackKnight) {
      tempElem = templateKnight;
    } else if (data === WhiteBishop || data === BlackBishop) {
      tempElem = templateBishop;
    } else if (data === WhiteRook || data === BlackRook) {
      tempElem = templateRook;
    } else if (data === WhiteQueen || data === BlackQueen) {
      tempElem = templateQueen;
    } else if (data === WhiteKing || data === BlackKing) {
      tempElem = templateKing;
    }

    const mark = getPieceMark(data);
    if (mark === White) {
      color = "white";
    } else if (mark === Black) {
      color = "black";
    }

    const cell = cells[i];
    while (cell.firstChild) cell.removeChild(cell.lastChild);

    if (tempElem !== undefined) {
      const elem = document.createElement("span");
      elem.className = `piece-${color}`;
      elem.appendChild(tempElem.content.cloneNode(true));

      cell.appendChild(elem);
    }
  }
};

const getPieceMark = (piece) => {
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

const doAction = (boardData, mark, action) => {
  if (action.type === "move") {
    boardData[action.moveTo] = boardData[action.moveFrom];
    boardData[action.moveFrom] = Empty;
  }
};

const invertMark = (mark) => {
  if (mark === Black) {
    return White;
  } else if (mark === White) {
    return Black;
  }
};

const isFinished = (boardData) => {
  return false;
};

const humanPlayer = {
  boardData: [],
  promise: new Promise(() => {}),

  reset() {
    humanPlayer.promise = new Promise((resolve) => {
      humanPlayer.resolve = resolve;
    });
  },

  resolve: () => {},

  async getMove(boardData, mark) {
    humanPlayer.boardData = boardData;
    humanPlayer.reset();

    let moveFrom;

    while (moveFrom === undefined) {
      let clicked = await humanPlayer.promise;
      humanPlayer.reset();

      if (getPieceMark(boardData[clicked]) === mark) {
        moveFrom = clicked;
      }
    }

    let moveTo;

    while (moveTo === undefined) {
      let clicked = await humanPlayer.promise;
      humanPlayer.reset();

      if (getPieceMark(boardData[clicked]) !== mark) {
        moveTo = clicked;
      }
    }

    return { type: "move", moveFrom, moveTo };
  },
};

/**
 * IDから要素を取得する関数
 * @param {string} id
 * @returns {HTMLElement}
 */
const elem = (id) => {
  return document.getElementById(id);
};
