export const Empty = 0;
export const OMark = 1;
export const XMark = 2;
export const Reset = 10;

export const NnCStatusOWin = 1;
export const NnCStatusXWin = 2;
export const NnCStatusDraw = 3;
export const NnCStatusNextO = 4;
export const NnCStatusNextX = 5;
export const NnCStatusNone = 6;
export type NnCStatus =
  | typeof NnCStatusOWin
  | typeof NnCStatusXWin
  | typeof NnCStatusDraw
  | typeof NnCStatusNextO
  | typeof NnCStatusNextX
  | typeof NnCStatusNone;
