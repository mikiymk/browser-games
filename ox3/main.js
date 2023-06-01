export const main = () => {
  const boardData = Array(9).fill(-1);
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const id = `ox3-${i}`;
    const cell = elem(id);
    cells.push(cell);
  }

  const stat = elem("ox3-stat");
  const reset = elem("ox3-reset");

  let mark = 1;

  for (let index = 0; index < 9; index++) {
    const cell = cells[index];

    const onClick = () => {
      const cellData = boardData[index];
      if (mark != -1 && cellData == -1) {
        boardData[index] = mark;
        mark = mark == 1 ? 2 : 1;
        const winner = getWinner(boardData);
        if (winner != -1) {
          stat.innerText = winner == 1 ? "O win" : "X win";
          mark = -1;
        }
      }
      setBoard(cells, boardData);
    };

    cell.addEventListener("click", onClick);
  }

  const onReset = () => {
    boardData.fill(-1);
    mark = 1;
    stat.innerText = "";
    setBoard(cells, boardData);
  };

  reset.addEventListener("click", onReset);
};

const elem = (id) => {
  return document.getElementById(id);
};

const getWinner = (boardData) => {
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

  for (const line of winnerLines) {
    const [cell1, cell2, cell3] = line.map((num) => boardData[num]);

    if (cell1 != -1 && cell1 == cell2 && cell1 == cell3) {
      return cell1;
    }
  }

  return -1;
};

const setBoard = (cells, boardData) => {
  const charO = elem("ox3-temp-o");
  const charX = elem("ox3-temp-x");

  for (let i = 0; i < 9; i++) {
    const cell = cells[i];
    while (cell.firstChild) cell.removeChild(cell.lastChild);
    const cellData = boardData[i];
    if (cellData == 1) {
      cell.appendChild(charO.content.cloneNode(true));
    } else if (cellData == 2) {
      cell.appendChild(charX.content.cloneNode(true));
    }
  }
};
