import { Bombed, Clear, FieldFlag, FieldNoOpen } from "./consts";

const diffArray: [number, number][] = [
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
];

export const getAround = (height: number, width: number, index: number): number[] => {
  const x = Math.floor(index / width);
  const y = index % width;

  const around: number[] = [];
  for (const [dx, dy] of diffArray) {
    if (x + dx < 0 || height <= x + dx || y + dy < 0 || width <= y + dy) {
      continue;
    }

    around.push((x + dx) * width + y + dy);
  }

  return around;
};

export const isClear = (fields: number[], mines: Set<number>): boolean => {
  for (const [index, field] of fields.entries()) {
    if (field < 0 && !mines.has(index)) {
      return false;
    }
  }

  return true;
};

export const initializeField = (length: number): number[] => {
  return Array.from({ length }, () => FieldNoOpen);
};

export const message = (state: number, fields: number[], numberMines: number): string => {
  let flagCount = 0;
  if (state === Bombed) {
    return "bombed";
  }
  if (state === Clear) {
    return "cleared";
  }

  for (const field of fields) {
    if (field === FieldFlag) {
      flagCount++;
    }
  }

  return `${numberMines - flagCount} mines`;
};

export const resetMines = (numberMines: number, height: number, width: number, firstClick: number): Set<number> => {
  const mines = new Set<number>([]);

  const around = new Set([firstClick, ...getAround(height, width, firstClick)]);
  const length = height * width;
  const amount = numberMines;

  if (length - 9 < amount) {
    throw new Error(`number of mines ${amount} is greater than fields length ${length - 9}.`);
  }

  while (mines.size !== amount) {
    const index = Math.floor(Math.random() * length);
    if (!around.has(index)) {
      mines.add(index);
    }
  }

  return mines;
};
