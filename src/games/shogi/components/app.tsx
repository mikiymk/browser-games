import { createSignal } from "solid-js";
import type { JSXElement } from "solid-js";
import { ShogiBoard } from "./board";
import { PlayerTypeAi, PlayerTypeHuman, playerType } from "@/scripts/player";

export const App = (): JSXElement => {
  const query = new URLSearchParams(location.search);

  const playerFirst = playerType(query.get("first"), PlayerTypeHuman);
  const playerSecond = playerType(query.get("second"), PlayerTypeAi);

  const [board, setBoard] = createSignal<number[]>(Array.from({ length: 81 }, (_, index) => index % 15));

  return (
    <>
      <ShogiBoard board={board()} />
    </>
  );
};
