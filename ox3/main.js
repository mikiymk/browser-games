// マークが書かれていない
const Empty = -1;
// ◯マークが書かれている
const OMarked = 1;
// ✗マークが書かれている
const XMarked = 2;

// 盤のサイズ
const BoardLength = 9;

// 勝利条件のインデックス一覧
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

export const main = () => {
  // マス目要素のリスト
  const cells = [];
  for (let i = 0; i < BoardLength; i++) {
    const id = `ox3-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  // 現在の状態を表示する要素
  const stat = elem("ox3-stat");
  // リセットボタン要素
  const reset = elem("ox3-reset");

  // マス目に入っているデータのリスト
  const boardData = Array(BoardLength);
  // 次にクリックした時のマーク
  let mark = Empty;

  // 各要素にクリック時の関数を登録する
  for (let index = 0; index < BoardLength; index++) {
    const cell = cells[index];

    // マスをクリックしたときの関数
    const onClick = () => {
      const cellData = boardData[index];

      // 次のマークが空ではなく、クリックしたマスが空の場合
      // マスを埋める処理をする
      if (mark != Empty && cellData == Empty) {
        // データにマークを入れる
        boardData[index] = mark;

        // 次のマークに更新する
        mark = mark == OMarked ? XMarked : OMarked;

        // 勝ちが決まったか確認する
        const winner = getWinner(boardData);
        // どちらかが勝った場合
        if (winner != Empty) {
          // 状態テキストを更新する
          stat.innerText = winner == OMarked ? "O win" : "X win";
          // 次のマークができないようにする
          mark = Empty;
        }
      }

      // データから表示を更新する
      setBoard(cells, boardData);
    };

    // マスに関数を登録する
    cell.addEventListener("click", onClick);
  }

  // リセットボタンを押したときの関数
  const onReset = () => {
    // マスを空で埋める
    boardData.fill(Empty);
    // 最初のマークを決める
    mark = OMarked;
    // 状態テキストを更新する
    stat.innerText = "";
    // ボードのデータを反映する
    setBoard(cells, boardData);
  };

  // ボタンに関数を登録する
  reset.addEventListener("click", onReset);

  // 最初にリセットしておく
  onReset();
};

// IDから要素を取得する関数
const elem = (id) => {
  return document.getElementById(id);
};

// 勝利者を取得する関数
// いない場合は空を返す
const getWinner = (boardData) => {
  // 各ラインについて判断する
  for (const line of winnerLines) {
    // ライン上のデータを取得
    const [cell1, cell2, cell3] = line.map((num) => boardData[num]);

    // データが空でなく、１・２・３が同じなら勝利
    // 勝利者の番号を返す
    if (cell1 != Empty && cell1 == cell2 && cell1 == cell3) {
      return cell1;
    }
  }

  // 各ラインで勝利者がいなかった場合
  // 空を返す
  return Empty;
};

// 表示ボードにデータを反映する関数
const setBoard = (cells, boardData) => {
  // ◯の要素テンプレート
  const charO = elem("ox3-temp-o");
  // ✗の要素テンプレート
  const charX = elem("ox3-temp-x");

  // 各マスごとに処理する
  for (let i = 0; i < BoardLength; i++) {
    const cell = cells[i];

    // もとの子要素をすべて削除する
    while (cell.firstChild) cell.removeChild(cell.lastChild);

    const cellData = boardData[i];

    // データが◯の場合と✗の場合で入れる要素を変える
    if (cellData == OMarked) {
      // ◯の場合
      cell.appendChild(charO.content.cloneNode(true));
    } else if (cellData == XMarked) {
      // ✗の場合
      cell.appendChild(charX.content.cloneNode(true));
    }
  }
};
