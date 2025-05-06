import type { JSXElement } from "solid-js";

import { Define } from "../../../components/define/define.tsx";
import { Court, Pip, SpadeAce } from "./card.tsx";
import { CLUB, DIAMOND, HEART, SPADE } from "./id.ts";
import { SuitClub, SuitDiamond, SuitHeart, SuitSpade } from "./suit.tsx";

export const DefineCards = (): JSXElement => {
  return (
    <Define>
      <SuitSpade />
      <SuitClub />
      <SuitDiamond />
      <SuitHeart />

      <SpadeAce />
      <Pip rank={2} suit={SPADE} />
      <Pip rank={3} suit={SPADE} />
      <Pip rank={4} suit={SPADE} />
      <Pip rank={5} suit={SPADE} />
      <Pip rank={6} suit={SPADE} />
      <Pip rank={7} suit={SPADE} />
      <Pip rank={8} suit={SPADE} />
      <Pip rank={9} suit={SPADE} />
      <Pip rank="t" suit={SPADE} />
      <Court rank="j" suit={SPADE} />
      <Court rank="q" suit={SPADE} />
      <Court rank="k" suit={SPADE} />

      <Pip rank="a" suit={CLUB} />
      <Pip rank={2} suit={CLUB} />
      <Pip rank={3} suit={CLUB} />
      <Pip rank={4} suit={CLUB} />
      <Pip rank={5} suit={CLUB} />
      <Pip rank={6} suit={CLUB} />
      <Pip rank={7} suit={CLUB} />
      <Pip rank={8} suit={CLUB} />
      <Pip rank={9} suit={CLUB} />
      <Pip rank="t" suit={CLUB} />
      <Court rank="j" suit={CLUB} />
      <Court rank="q" suit={CLUB} />
      <Court rank="k" suit={CLUB} />

      <Pip rank="a" suit={DIAMOND} />
      <Pip rank={2} suit={DIAMOND} />
      <Pip rank={3} suit={DIAMOND} />
      <Pip rank={4} suit={DIAMOND} />
      <Pip rank={5} suit={DIAMOND} />
      <Pip rank={6} suit={DIAMOND} />
      <Pip rank={7} suit={DIAMOND} />
      <Pip rank={8} suit={DIAMOND} />
      <Pip rank={9} suit={DIAMOND} />
      <Pip rank="t" suit={DIAMOND} />
      <Court rank="j" suit={DIAMOND} />
      <Court rank="q" suit={DIAMOND} />
      <Court rank="k" suit={DIAMOND} />

      <Pip rank="a" suit={HEART} />
      <Pip rank={2} suit={HEART} />
      <Pip rank={3} suit={HEART} />
      <Pip rank={4} suit={HEART} />
      <Pip rank={5} suit={HEART} />
      <Pip rank={6} suit={HEART} />
      <Pip rank={7} suit={HEART} />
      <Pip rank={8} suit={HEART} />
      <Pip rank={9} suit={HEART} />
      <Pip rank="t" suit={HEART} />
      <Court rank="j" suit={HEART} />
      <Court rank="q" suit={HEART} />
      <Court rank="k" suit={HEART} />
    </Define>
  );
};
