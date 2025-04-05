import type { JSXElement } from "solid-js";
import {
  Black,
  End5Repetition,
  End75Moves,
  EndBlackWin,
  EndInsufficientMaterial,
  EndStalemate,
  EndWhiteWin,
} from "../constants.ts";

type StatusProperties = {
  readonly color: number;
  readonly end: number;
};

export const Status = (properties: StatusProperties): JSXElement => {
  const message = (): string => {
    switch (properties.end) {
      case EndBlackWin: {
        return "black win";
      }
      case EndWhiteWin: {
        return "white win";
      }
      case EndStalemate: {
        return "draw - stalemate";
      }
      case End75Moves: {
        return "draw - Seventy-five-move";
      }
      case End5Repetition: {
        return "draw - Fivefold repetition";
      }
      case EndInsufficientMaterial: {
        return "draw - Insufficient material";
      }
      default: {
        return properties.color === Black ? "black" : "white";
      }
    }
  };
  return <output>{message()}</output>;
};
