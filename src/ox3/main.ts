const Empty = -1;
const OMarked = 1;
const XMarked = 2;
const Reset = 10;

// 盤のサイズ
const BoardLength = 9;

/**
 * 勝利条件のインデックス一覧
 * @type {[number, number, number][]}
 */
const winnerLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

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
/**
 * ◯テンプレート要素
 * @type {HTMLTemplateElement}
 */
let charO;
/**
 * ✗テンプレート要素
 * @type {HTMLTemplateElement}
 */
let charX;

/**
 * メイン関数
 */
export const main = () => {
  const players = {
    [OMarked]: humanPlayer,
    [XMarked]: aiPlayer,
  };

  // 要素を代入する
  for (let i = 0; i < BoardLength; i++) {
    const id = `ox3-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  stat = elem("ox3-stat");
  reset = elem("ox3-reset");
  charO = elem("ox3-temp-o");
  charX = elem("ox3-temp-x");

  const settings = elem("ox3-settings");
  const openSettings = elem("ox3-open-settings");
  const closeSettings = elem("ox3-close-settings");
  const playerO = elem("ox3-player-o");
  const playerX = elem("ox3-player-x");

  openSettings.addEventListener("click", () => {
    settings.showModal();
  });

  closeSettings.addEventListener("click", () => {
    settings.close();
  });

  playerO.addEventListener("change", (event) => {
    const value = event.currentTarget.value;
    console.log(value);
    if (value === "human") {
      players[OMarked] = humanPlayer;
    } else if (value === "ai") {
      players[OMarked] = aiPlayer;
    }
  });

  playerX.addEventListener("change", (event) => {
    const value = event.currentTarget.value;
    if (value === "human") {
      players[XMarked] = humanPlayer;
    } else if (value === "ai") {
      players[XMarked] = aiPlayer;
    }
  });

  playerO.value = "human";
  playerX.value = "ai";

  for (let index = 0; index < BoardLength; index++) {
    const cell = cells[index];

    const onClick = () => {
      const cellData = humanPlayer.boardData[index];

      // 次のマークが空ではなく、クリックしたマスが空の場合
      if (cellData === Empty) {
        humanPlayer.resolve(index);
      }
    };

    cell.addEventListener("click", onClick);
  }

  const onReset = () => {
    humanPlayer.resolve(Reset);

    gameLoop(players);
  };

  reset.addEventListener("click", onReset);

  gameLoop(players);
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

  getMarkIndex(boardData, mark) {
    humanPlayer.boardData = boardData;
    humanPlayer.reset();

    return humanPlayer.promise;
  },
};

const aiPlayer = {
  getMarkIndex(boardData, mark) {
    // 各ラインで相手が2つと空きマスの場合、空きマスを選ぶ
    const clearCells = [];
    const interCells = [];
    for (const line of winnerLines) {
      const [cell1, cell2, cell3] = line.map((num) => boardData[num]);

      if (cell1 === invertMark(mark) && cell1 === cell2 && cell3 === Empty) {
        interCells.push(line[2]);
      }
      if (cell2 === invertMark(mark) && cell2 === cell3 && cell1 === Empty) {
        interCells.push(line[0]);
      }
      if (cell3 === invertMark(mark) && cell3 === cell1 && cell2 === Empty) {
        interCells.push(line[1]);
      }

      if (cell1 === mark && cell1 === cell2 && cell3 === Empty) {
        clearCells.push(line[2]);
      }
      if (cell2 === mark && cell2 === cell3 && cell1 === Empty) {
        clearCells.push(line[0]);
      }
      if (cell3 === mark && cell3 === cell1 && cell2 === Empty) {
        clearCells.push(line[1]);
      }
    }

    // 空きマス
    const emptyCells = [];
    for (let i = 0; i < BoardLength; i++) {
      const cell = boardData[i];
      if (cell === Empty) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      // 見つからなかったら終了
      return Reset;
    }

    // ランダム
    return randomSelect(clearCells) ?? randomSelect(interCells) ?? randomSelect(emptyCells) ?? Reset;
  },
};

const randomSelect = (list) => {
  if (list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
};

const gameLoop = async (players) => {
  let mark = OMarked;
  const boardData = Array(BoardLength).fill(Empty);

  setBoard(cells, boardData);

  while (true) {
    const player = players[mark];

    stat.innerText = mark === OMarked ? "O mark" : "X mark";

    const index = await player.getMarkIndex(boardData, mark);

    if (index === Reset) {
      break;
    }

    boardData[index] = mark;
    mark = invertMark(mark);

    setBoard(cells, boardData);

    // 勝ちが決まったか確認する
    const winner = getWinner(boardData);
    if (winner !== Empty) {
      stat.innerText = winner === OMarked ? "O win" : "X win";

      break;
    }

    // すべて埋まっているか確認する
    let count = 0;
    for (let i = 0; i < BoardLength; i++) {
      if (boardData[i] !== -1) {
        count++;
      }
    }
    if (count === 9) {
      stat.innerText = "filled";
      break;
    }
  }
};

/**
 * IDから要素を取得する関数
 * @param {string} id
 * @returns {HTMLElement}
 */
const elem = (id) => {
  return document.getElementById(id);
};

const invertMark = (mark) => {
  return mark === OMarked ? XMarked : OMarked;
};

/**
 * 勝利者を取得する関数
 * いない場合は空を返す
 * @param {(-1 | 1 | 2)[]} boardData
 */
const getWinner = (boardData) => {
  for (const line of winnerLines) {
    const [cell1, cell2, cell3] = line.map((num) => boardData[num]);

    // データが空でなく、１・２・３が同じなら勝利
    if (cell1 !== Empty && cell1 === cell2 && cell1 === cell3) {
      return cell1;
    }
  }

  // 各ラインで勝利者がいなかった場合
  return Empty;
};

/**
 * 表示ボードにデータを反映する関数
 * @param {HTMLElement[]} cells
 * @param {(-1 | 1 | 2)[]} boardData
 */
const setBoard = (cells, boardData) => {
  for (let i = 0; i < BoardLength; i++) {
    const cell = cells[i];

    // もとの子要素をすべて削除する
    while (cell.firstChild) cell.removeChild(cell.lastChild);

    const cellData = boardData[i];

    if (cellData === OMarked) {
      cell.appendChild(charO.content.cloneNode(true));
    } else if (cellData === XMarked) {
      cell.appendChild(charX.content.cloneNode(true));
    }
  }
};
