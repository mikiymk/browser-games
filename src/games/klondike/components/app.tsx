import type { JSXElement } from "solid-js";
import { Card, CardBack } from "./card";

export const App = (): JSXElement => {
  return (
    <>
      <svg viewBox="0 0 142 66" xmlns="http://www.w3.org/2000/svg">
        <rect height={66} width={142} fill="green" />
        <title>cards</title>

        <Card suit="spade" rank={1} x={1} y={1} />
        <Card suit="spade" rank={2} x={11} y={1} />
        <Card suit="spade" rank={3} x={21} y={1} />
        <Card suit="spade" rank={4} x={31} y={1} />
        <Card suit="spade" rank={5} x={41} y={1} />
        <Card suit="spade" rank={6} x={51} y={1} />
        <Card suit="spade" rank={7} x={61} y={1} />
        <Card suit="spade" rank={8} x={71} y={1} />
        <Card suit="spade" rank={9} x={81} y={1} />
        <Card suit="spade" rank={10} x={91} y={1} />
        <Card suit="spade" rank={11} x={101} y={1} />
        <Card suit="spade" rank={12} x={111} y={1} />
        <Card suit="spade" rank={13} x={121} y={1} />
        <CardBack x={131} y={1} />

        <Card suit="heart" rank={1} x={1} y={17} />
        <Card suit="heart" rank={2} x={11} y={17} />
        <Card suit="heart" rank={3} x={21} y={17} />
        <Card suit="heart" rank={4} x={31} y={17} />
        <Card suit="heart" rank={5} x={41} y={17} />
        <Card suit="heart" rank={6} x={51} y={17} />
        <Card suit="heart" rank={7} x={61} y={17} />
        <Card suit="heart" rank={8} x={71} y={17} />
        <Card suit="heart" rank={9} x={81} y={17} />
        <Card suit="heart" rank={10} x={91} y={17} />
        <Card suit="heart" rank={11} x={101} y={17} />
        <Card suit="heart" rank={12} x={111} y={17} />
        <Card suit="heart" rank={13} x={121} y={17} />
        <CardBack x={131} y={17} />

        <Card suit="diamond" rank={1} x={1} y={33} />
        <Card suit="diamond" rank={2} x={11} y={33} />
        <Card suit="diamond" rank={3} x={21} y={33} />
        <Card suit="diamond" rank={4} x={31} y={33} />
        <Card suit="diamond" rank={5} x={41} y={33} />
        <Card suit="diamond" rank={6} x={51} y={33} />
        <Card suit="diamond" rank={7} x={61} y={33} />
        <Card suit="diamond" rank={8} x={71} y={33} />
        <Card suit="diamond" rank={9} x={81} y={33} />
        <Card suit="diamond" rank={10} x={91} y={33} />
        <Card suit="diamond" rank={11} x={101} y={33} />
        <Card suit="diamond" rank={12} x={111} y={33} />
        <Card suit="diamond" rank={13} x={121} y={33} />
        <CardBack x={131} y={33} />

        <Card suit="club" rank={1} x={1} y={49} />
        <Card suit="club" rank={2} x={11} y={49} />
        <Card suit="club" rank={3} x={21} y={49} />
        <Card suit="club" rank={4} x={31} y={49} />
        <Card suit="club" rank={5} x={41} y={49} />
        <Card suit="club" rank={6} x={51} y={49} />
        <Card suit="club" rank={7} x={61} y={49} />
        <Card suit="club" rank={8} x={71} y={49} />
        <Card suit="club" rank={9} x={81} y={49} />
        <Card suit="club" rank={10} x={91} y={49} />
        <Card suit="club" rank={11} x={101} y={49} />
        <Card suit="club" rank={12} x={111} y={49} />
        <Card suit="club" rank={13} x={121} y={49} />
        <CardBack x={131} y={49} />
      </svg>
    </>
  );
};
