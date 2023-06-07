const Empty = -1;
const OMarked = 1;
const XMarked = 2;
const Reset = 10;

// 盤のサイズ
const BoardLength = 9;

/**
 * 勝利条件のインデックス一覧
 */
const winnerLines: [Index, Index, Index][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const indexes: Tuple<Index, 9> = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const cells = [] as HTMLElement[] as Tuple<HTMLElement, 9>;
let stat: HTMLElement;
let reset: HTMLElement;
let charO: HTMLTemplateElement;
let charX: HTMLTemplateElement;

type Mark = typeof OMarked | typeof XMarked;
type Empty = typeof Empty;
type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Tuple<T, N, List extends T[] = []> = List["length"] extends N ? List : Tuple<T, N, [T, ...List]>;

type BoardData = Tuple<Mark | Empty, 9>;

type Awaitable<T> = T | Promise<T>;
interface Player {
  getMarkIndex(boardData: BoardData, mark: Mark): Awaitable<Index | typeof Reset>;
}

type Players = Record<Mark, Player>;

/**
 * メイン関数
 */
export const main = () => {
  const players: Players = {
    [OMarked]: humanPlayer,
    [XMarked]: aiPlayer,
  };

  // 要素を代入する
  for (const index of indexes) {
    const id = `ox3-${index}`;
    const cell = element(id);
    cells.push(cell);
  }

  stat = element("ox3-stat");
  reset = element("ox3-reset");
  charO = element("ox3-temp-o") as HTMLTemplateElement;
  charX = element("ox3-temp-x") as HTMLTemplateElement;

  const settings = element("ox3-settings") as HTMLDialogElement;
  const openSettings = element("ox3-open-settings");
  const closeSettings = element("ox3-close-settings");
  const playerO = element("ox3-player-o") as HTMLInputElement;
  const playerX = element("ox3-player-x") as HTMLInputElement;

  openSettings.addEventListener("click", () => {
    settings.showModal();
  });

  closeSettings.addEventListener("click", () => {
    settings.close();
  });

  playerO.addEventListener("change", (event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    console.log(value);
    if (value === "human") {
      players[OMarked] = humanPlayer;
    } else if (value === "ai") {
      players[OMarked] = aiPlayer;
    }
  });

  playerX.addEventListener("change", (event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    if (value === "human") {
      players[XMarked] = humanPlayer;
    } else if (value === "ai") {
      players[XMarked] = aiPlayer;
    }
  });

  playerO.value = "human";
  playerX.value = "ai";

  for (const index of indexes) {
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

    void gameLoop(players);
  };

  reset.addEventListener("click", onReset);

  void gameLoop(players);
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

  getMarkIndex(boardData: BoardData, mark: Mark) {
    humanPlayer.boardData = boardData;
    humanPlayer.reset();

    return humanPlayer.promise as Promise<Index | typeof Reset>;
  },
};

const aiPlayer = {
  getMarkIndex(boardData: BoardData, mark: Mark) {
    // 各ラインで相手が2つと空きマスの場合、空きマスを選ぶ
    const clearCells: Index[] = [];
    const interCells: Index[] = [];
    const emptyCells: Index[] = [];

    for (const line of winnerLines) {
      const [cell1, cell2, cell3] = line.map((number) => boardData[number]);

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
    for (const index of indexes) {
      const cell = boardData[index];
      if (cell === Empty) {
        emptyCells.push(index);
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

const randomSelect = <T>(list: T[]): T | undefined => {
  if (list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
};

const gameLoop = async (players: Players) => {
  let mark: Mark = OMarked;
  const boardData = Array.from<Mark | Empty>({ length: BoardLength }).fill(Empty) as BoardData;

  setBoard(cells, boardData);

  for (;;) {
    const player = players[mark];

    stat.textContent = mark === OMarked ? "O mark" : "X mark";

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
      stat.textContent = winner === OMarked ? "O win" : "X win";

      break;
    }

    // すべて埋まっているか確認する
    let count = 0;
    for (const index of indexes) {
      if (boardData[index] !== -1) {
        count++;
      }
    }
    if (count === 9) {
      stat.textContent = "filled";
      break;
    }
  }
};

/**
 * IDから要素を取得する関数
 */
const element = (id: string): HTMLElement => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return document.getElementById(id)!;
};

const invertMark = (mark: Mark) => {
  return mark === OMarked ? XMarked : OMarked;
};

/**
 * 勝利者を取得する関数
 * いない場合は空を返す
 */
const getWinner = (boardData: (-1 | 1 | 2)[]) => {
  for (const line of winnerLines) {
    const [cell1, cell2, cell3] = line.map((number) => boardData[number]);

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
 */
const setBoard = (cells: HTMLElement[], boardData: BoardData) => {
  for (const index of indexes) {
    const cell = cells[index];

    // もとの子要素をすべて削除する
    while (cell?.firstChild) cell.lastChild?.remove();

    const cellData = boardData[index];

    if (cellData === OMarked) {
      cell?.append(charO.content.cloneNode(true));
    } else if (cellData === XMarked) {
      cell?.append(charX.content.cloneNode(true));
    }
  }
};
