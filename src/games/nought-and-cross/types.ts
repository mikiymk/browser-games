export const Empty = 0;
export const MarkO = 1;
export const MarkX = 2;
export const Reset = 10;

export const StatusWinO = 1;
export const StatusWinX = 2;
export const StatusDraw = 3;
export const StatusNextO = 4;
export const StatusNextX = 5;
export const StatusNone = 6;
export type Status =
  | typeof StatusWinO
  | typeof StatusWinX
  | typeof StatusDraw
  | typeof StatusNextO
  | typeof StatusNextX
  | typeof StatusNone;
