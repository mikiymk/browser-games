import { Anchor } from "@/components/elements/anchor";
import { List, ListItem } from "@/components/elements/list";
import { PageBody } from "@/components/page/body";
import { PageHeader } from "@/components/page/header";
import {
  TEXT_GAME_CHESS,
  TEXT_GAME_ENGLISH_DRAUGHTS,
  TEXT_GAME_KLONDIKE,
  TEXT_GAME_KNIGHT_TOUR,
  TEXT_GAME_MINE_SWEEPER,
  TEXT_GAME_NOUGHT_AND_CROSS,
  TEXT_GAME_REVERSI,
  TEXT_GAME_SHOGI,
} from "@/scripts/constants";
import { For } from "solid-js";
import type { JSXElement } from "solid-js";

const pages = [
  { title: TEXT_GAME_NOUGHT_AND_CROSS, name: "nought-and-cross" },
  { title: TEXT_GAME_CHESS, name: "chess" },
  { title: TEXT_GAME_MINE_SWEEPER, name: "mine-sweeper" },
  { title: TEXT_GAME_KNIGHT_TOUR, name: "knight-tour" },
  { title: TEXT_GAME_REVERSI, name: "reversi" },
  { title: TEXT_GAME_SHOGI, name: "shogi" },
  { title: TEXT_GAME_KLONDIKE, name: "klondike" },
  { title: TEXT_GAME_ENGLISH_DRAUGHTS, name: "english-draughts" },
];

export const IndexContent = (): JSXElement => {
  return (
    <>
      <PageHeader />
      <PageBody>
        <List>
          <For each={pages}>
            {({ title, name }) => (
              <ListItem>
                <Anchor href={`${name}/`}>{title}</Anchor>
              </ListItem>
            )}
          </For>
        </List>
      </PageBody>
    </>
  );
};
