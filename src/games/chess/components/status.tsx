import {
  Black,
  End5Repetition,
  End75Moves,
  EndBlackWin,
  EndInsufficientMaterial,
  EndStalemate,
  EndWhiteWin,
} from "../constants.ts";

import type { JSXElement } from "solid-js";

type StatusProperties = {
  readonly color: number;
  readonly end: number;
};

export const Status = (properties: StatusProperties): JSXElement => {
  const message = (): string => {
    switch (properties.end) {
      case End5Repetition: {
        return "draw - Fivefold repetition";
      }
      case End75Moves: {
        return "draw - Seventy-five-move";
      }
      case EndBlackWin: {
        return "black win";
      }
      case EndInsufficientMaterial: {
        return "draw - Insufficient material";
      }
      case EndStalemate: {
        return "draw - stalemate";
      }
      case EndWhiteWin: {
        return "white win";
      }
      default: {
        return properties.color === Black ? "black" : "white";
      }
    }
  };
  return <output>{message()}</output>;
};
