import { Button } from "@/components/button";
import {
  Black,
  End5Repetition,
  End75Moves,
  EndBlackWin,
  EndInsufficientMaterial,
  EndStalemate,
  EndWhiteWin,
} from "@/games/chess/constants";
import type { JSXElement } from "solid-js";

type ControllerProperties = {
  readonly color: number;
  readonly end: number;

  readonly start: () => void;
};

export const Controller = (properties: ControllerProperties): JSXElement => {
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
  return (
    <div>
      <p>
        status:
        <output>{message()}</output>
      </p>

      <Button
        onClick={() => {
          properties.start();
        }}
      >
        start
      </Button>
    </div>
  );
};
