import type { JSXElement } from "solid-js";

import { For } from "solid-js";

import {
  TEXT_GAME_BULLS_AND_COWS,
  TEXT_GAME_CHESS,
  TEXT_GAME_ENGLISH_DRAUGHTS,
  TEXT_GAME_KLONDIKE,
  TEXT_GAME_KNIGHT_TOUR,
  TEXT_GAME_MINE_SWEEPER,
  TEXT_GAME_NOUGHT_AND_CROSS,
  TEXT_GAME_REVERSI,
  TEXT_GAME_SHOGI,
} from "../scripts/constants.ts";
import { Anchor } from "./elements/anchor.tsx";
import { List, ListItem } from "./elements/list.tsx";
import { Page } from "./page/page.tsx";

const pages = [
  { name: "nought-and-cross", title: TEXT_GAME_NOUGHT_AND_CROSS },
  { name: "chess", title: TEXT_GAME_CHESS },
  { name: "mine-sweeper", title: TEXT_GAME_MINE_SWEEPER },
  { name: "knight-tour", title: TEXT_GAME_KNIGHT_TOUR },
  { name: "reversi", title: TEXT_GAME_REVERSI },
  { name: "shogi", title: TEXT_GAME_SHOGI },
  { name: "klondike", title: TEXT_GAME_KLONDIKE },
  { name: "english-draughts", title: TEXT_GAME_ENGLISH_DRAUGHTS },
  { name: "bulls-and-cows", title: TEXT_GAME_BULLS_AND_COWS },
  { name: "image-view", title: "Image View" },
];

export const IndexContent = (): JSXElement => {
  return (
    <Page>
      <List>
        <For each={pages}>
          {({ name, title }) => (
            <ListItem>
              <Anchor href={`${name}/`}>{title}</Anchor>
            </ListItem>
          )}
        </For>
      </List>
    </Page>
  );
};
