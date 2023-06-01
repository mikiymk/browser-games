const Empty = -1;
const OMarked = 1;
const XMarked = 2;

const BoardLength = 9;

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
  const boardData = Array(BoardLength);
  const cells = [];
  for (let i = 0; i < BoardLength; i++) {
    const id = `ox3-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  const stat = elem("ox3-stat");
  const reset = elem("ox3-reset");

  let mark = Empty;

  for (let index = 0; index < BoardLength; index++) {
    const cell = cells[index];

    const onClick = () => {
      const cellData = boardData[index];
      if (mark != Empty && cellData == Empty) {
        boardData[index] = mark;
        mark = mark == OMarked ? XMarked : OMarked;
        const winner = getWinner(boardData);
        if (winner != Empty) {
          stat.innerText = winner == OMarked ? "O win" : "X win";
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

const elem = (id) => {
  return document.getElementById(id);
};

const getWinner = (boardData) => {
  for (const line of winnerLines) {
    const [cell1, cell2, cell3] = line.map((num) => boardData[num]);

    if (cell1 != Empty && cell1 == cell2 && cell1 == cell3) {
      return cell1;
    }
  }

  return Empty;
};

const setBoard = (cells, boardData) => {
  const charO = elem("ox3-temp-o");
  const charX = elem("ox3-temp-x");

  for (let i = 0; i < BoardLength; i++) {
    const cell = cells[i];
    while (cell.firstChild) cell.removeChild(cell.lastChild);
    const cellData = boardData[i];
    if (cellData == OMarked) {
      cell.appendChild(charO.content.cloneNode(true));
    } else if (cellData == XMarked) {
      cell.appendChild(charX.content.cloneNode(true));
    }
  }
};
