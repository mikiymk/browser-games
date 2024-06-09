import type { JSXElement } from "solid-js";
import { HeaderPopup } from "@/components/page-header/header-popup";

export const HowToPlay = (): JSXElement => {
  return (
    <HeaderPopup icon="help" label="How to Play">
      <h2>How to Play</h2>

      <ul>
        <li>8x8 board.</li>
        <li>64 stones. One side is painted dark, the other light.</li>
      </ul>

      <p>Two players, dark and light, play against each other.</p>
      <p>Dark and light take turns placing one stone each, aiming to have more stones at the end.</p>
      <p>
        Place one of your stones in a square on the board. Turn over the opponent's stones that are sandwiched
        vertically, horizontally, or diagonally between your stones already on the board and the stones you have just
        placed, and make them your stones.
      </p>
      <p>You cannot place a stone in a place where it cannot be sandwiched.</p>
      <p>If there is no place where it can be placed, it is the opponent's turn without placing a stone. (Pass)</p>
      <p>
        If neither player can place a stone, the game ends. The number of stones on the board is counted, and the player
        with the most stones wins.
      </p>
    </HeaderPopup>
  );
};
