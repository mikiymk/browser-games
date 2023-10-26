import smallBlackStone from "@/images/reversi/stone-black-small.svg";
import blackStone from "@/images/reversi/stone-black.svg";
import smallWhiteStone from "@/images/reversi/stone-white-small.svg";
import whiteStone from "@/images/reversi/stone-white.svg";
import empty from "@/images/symbol/empty.svg";

import { CellBlack, CellCanMoveBlack, CellCanMoveWhite, CellWhite } from "./const";

type CellImageProperties = {
  square: number;
};
export const CellImage = (properties: CellImageProperties) => {
  const source = () => {
    return (
      {
        [CellBlack]: blackStone.src,
        [CellWhite]: whiteStone.src,
        [CellCanMoveBlack]: smallBlackStone.src,
        [CellCanMoveWhite]: smallWhiteStone.src,
      }[properties.square] ?? empty.src
    );
  };

  const alt = () => {
    return (
      {
        [CellBlack]: "black stone",
        [CellWhite]: "white stone",
        [CellCanMoveBlack]: "can put black stone",
        [CellCanMoveWhite]: "can put white stone",
      }[properties.square] ?? ""
    );
  };

  return <img src={source()} alt={alt()} />;
};
