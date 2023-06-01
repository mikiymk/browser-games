"use strict";

const main = () => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const boardData = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  const ids = nums.map((n) => `ox3-${n}`);
  const cells = ids.map((id) => document.getElementById(id));
  const stat = document.getElementById("ox3-stat");
  const reset = document.getElementById("ox3-reset");

  const charO = document.getElementById("ox3-temp-o");
  const charX = document.getElementById("ox3-temp-x");

  let mark = 1;

  const setBoard = () => {
    cells.forEach((cell, index) => {
      while (cell.firstChild) cell.removeChild(cell.lastChild);
      const cellData = boardData[index];
      if (cellData == 1) {
        cell.appendChild(charO.content.cloneNode(true));
      } else if (cellData == 2) {
        cell.appendChild(charX.content.cloneNode(true));
      }
    });
  };

  const getWinner = () => {
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
      const cell1 = boardData[line[0]];
      const cell2 = boardData[line[1]];
      const cell3 = boardData[line[2]];

      if (cell1 != -1 && cell1 == cell2 && cell1 == cell3) {
        return cell1;
      }
    }

    return -1;
  };

  const onClick = (number) => {
    const cellData = boardData[number];
    if (mark != -1 && cellData == -1) {
      boardData[number] = mark;
      mark = mark == 1 ? 2 : 1;
      const winner = getWinner();
      if (winner != -1) {
        stat.innerText = winner == 1 ? "O win" : "X win";
        mark = -1;
      }
    }
    setBoard();
  };

  cells.forEach((cell, index) =>
    cell.addEventListener("click", () => onClick(index))
  );

  reset.addEventListener("click", () => {
    for (let i = 0; i < 9; i++) {
      boardData[i] = -1;
    }
    mark = 1;
    stat.innerText = "";
    setBoard();
  });
};

document.addEventListener("DOMContentLoaded", main);
