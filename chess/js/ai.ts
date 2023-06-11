import { BoardData, Mark, Reset } from "./types";

export const createMessenger = <T>(): [Sender<T>, Receciver<T>] => {};

export const humanPlayer = {
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
