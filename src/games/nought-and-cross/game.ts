import { Empty, OMark, Reset, XMark, winnerLines } from "./types";

import type { Accessor, Setter } from "solid-js";
import type { BoardData, Index, Mark, Players } from "./types";

export const gameLoop = async (
  players: Players,
  boardData: Accessor<BoardData>,
  setBoardData: Setter<BoardData>,
  setHistory: Setter<Index[]>,
  setStatusMessage: Setter<string>,
) => {
  let mark: Mark = OMark;
  initializeBoard(setBoardData);
  setHistory([]);

  console.log("start game");

  for (;;) {
    const player = players[mark];

    setStatusMessage(mark === OMark ? "O mark" : "X mark");

    const index = await player.getMarkIndex(boardData, mark);

    if (index === Reset) {
      break;
    }

    doAction(setBoardData, mark, index);
    setHistory((previousHistory) => [...previousHistory, index]);
    mark = invertMark(mark);

    const finishMessage = isFinished(boardData);
    if (finishMessage) {
      setStatusMessage(finishMessage);
      break;
    }
  }

  console.log("end game");
};

const initializeBoard = (setBoardData: Setter<BoardData>) => {
  setBoardData((boardData) => boardData.map(() => Empty) as BoardData);
};

const doAction = (setBoardData: Setter<BoardData>, mark: Mark, index: Index) => {
  setBoardData((boardData) => {
    const newBoardData: BoardData = [...boardData];
    newBoardData[index] = mark;
    return newBoardData;
  });
};

export const invertMark = (mark: Mark) => {
  return mark === OMark ? XMark : OMark;
};

const isFinished = (boardData: Accessor<BoardData>): string | false => {
  // 勝ちが決まったか確認する
  const winner = getWinner(boardData);
  if (winner === OMark) {
    return "O win";
  }
  if (winner === XMark) {
    return "X win";
  }

  // すべて埋まっているか確認する
  let count = 0;
  for (const cell of boardData()) {
    if (cell !== Empty) {
      count++;
    }
  }
  if (count === 9) {
    return "filled";
  }

  return false;
};

const getWinner = (getBoardData: Accessor<BoardData>) => {
  for (const line of winnerLines) {
    const boardData = getBoardData();
    const [cell1, cell2, cell3] = line.map((number) => boardData[number]);

    // データが空でなく、１・２・３が同じなら勝利
    if (cell1 !== Empty && cell1 === cell2 && cell1 === cell3) {
      return cell1;
    }
  }

  // 各ラインで勝利者がいなかった場合
  return Empty;
};
