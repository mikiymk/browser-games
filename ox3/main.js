const Empty = -1;
const OMarked = 1;
const XMarked = 2;

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
 * メイン関数
 */
export const main = () => {
  /**
   * マス目要素のリスト
   * @type {HTMLElement[]}
   */
  const cells = [];
  for (let i = 0; i < BoardLength; i++) {
    const id = `ox3-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  const stat = elem("ox3-stat");
  const reset = elem("ox3-reset");

  /**
   * @type {(-1 | 1 | 2)[]}
   */
  const boardData = Array(BoardLength);
  let mark = Empty;

  for (let index = 0; index < BoardLength; index++) {
    const cell = cells[index];

    const onClick = () => {
      const cellData = boardData[index];

      // 次のマークが空ではなく、クリックしたマスが空の場合
      if (mark != Empty && cellData == Empty) {
        boardData[index] = mark;
        mark = mark == OMarked ? XMarked : OMarked;

        // 勝ちが決まったか確認する
        const winner = getWinner(boardData);
        if (winner != Empty) {
          // 状態テキストを更新する
          stat.innerText = winner == OMarked ? "O win" : "X win";
          // 次のマークができないようにする
          mark = Empty;
        }
      }

      setBoard(cells, boardData);
    };

    cell.addEventListener("click", onClick);
  }

  const onReset = () => {
    boardData.fill(Empty);
    mark = OMarked;
    stat.innerText = "";
    setBoard(cells, boardData);
  };

  reset.addEventListener("click", onReset);

  onReset();
};

/**
 * IDから要素を取得する関数
 * @param {string} id
 * @returns {HTMLElement}
 */
const elem = (id) => {
  return document.getElementById(id);
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
    if (cell1 != Empty && cell1 == cell2 && cell1 == cell3) {
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
  const charO = elem("ox3-temp-o");
  const charX = elem("ox3-temp-x");

  for (let i = 0; i < BoardLength; i++) {
    const cell = cells[i];

    // もとの子要素をすべて削除する
    while (cell.firstChild) cell.removeChild(cell.lastChild);

    const cellData = boardData[i];

    if (cellData == OMarked) {
      cell.appendChild(charO.content.cloneNode(true));
    } else if (cellData == XMarked) {
      cell.appendChild(charX.content.cloneNode(true));
    }
  }
};
