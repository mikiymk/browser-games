import type { JSXElement } from "solid-js";
import { Card } from "./card";
import { CLUB, DIAMOND, HEART, SPADE } from "../constants";

export const App = (): JSXElement => {
  return (
    <>
      <svg viewBox="0 0 132 66" xmlns="http://www.w3.org/2000/svg">
        <rect height={66} width={132} fill="green" />
        <title>cards</title>

        <Card suit={SPADE} rank={1} x={1} y={1} />
        <Card suit={SPADE} rank={2} x={11} y={1} />
        <Card suit={SPADE} rank={3} x={21} y={1} />
        <Card suit={SPADE} rank={4} x={31} y={1} />
        <Card suit={SPADE} rank={5} x={41} y={1} />
        <Card suit={SPADE} rank={6} x={51} y={1} />
        <Card suit={SPADE} rank={7} x={61} y={1} />
        <Card suit={SPADE} rank={8} x={71} y={1} />
        <Card suit={SPADE} rank={9} x={81} y={1} />
        <Card suit={SPADE} rank={10} x={91} y={1} />
        <Card suit={SPADE} rank={11} x={101} y={1} />
        <Card suit={SPADE} rank={12} x={111} y={1} />
        <Card suit={SPADE} rank={13} x={121} y={1} />

        <Card suit={HEART} rank={1} x={1} y={17} />
        <Card suit={HEART} rank={2} x={11} y={17} />
        <Card suit={HEART} rank={3} x={21} y={17} />
        <Card suit={HEART} rank={4} x={31} y={17} />
        <Card suit={HEART} rank={5} x={41} y={17} />
        <Card suit={HEART} rank={6} x={51} y={17} />
        <Card suit={HEART} rank={7} x={61} y={17} />
        <Card suit={HEART} rank={8} x={71} y={17} />
        <Card suit={HEART} rank={9} x={81} y={17} />
        <Card suit={HEART} rank={10} x={91} y={17} />
        <Card suit={HEART} rank={11} x={101} y={17} />
        <Card suit={HEART} rank={12} x={111} y={17} />
        <Card suit={HEART} rank={13} x={121} y={17} />

        <Card suit={DIAMOND} rank={1} x={1} y={33} />
        <Card suit={DIAMOND} rank={2} x={11} y={33} />
        <Card suit={DIAMOND} rank={3} x={21} y={33} />
        <Card suit={DIAMOND} rank={4} x={31} y={33} />
        <Card suit={DIAMOND} rank={5} x={41} y={33} />
        <Card suit={DIAMOND} rank={6} x={51} y={33} />
        <Card suit={DIAMOND} rank={7} x={61} y={33} />
        <Card suit={DIAMOND} rank={8} x={71} y={33} />
        <Card suit={DIAMOND} rank={9} x={81} y={33} />
        <Card suit={DIAMOND} rank={10} x={91} y={33} />
        <Card suit={DIAMOND} rank={11} x={101} y={33} />
        <Card suit={DIAMOND} rank={12} x={111} y={33} />
        <Card suit={DIAMOND} rank={13} x={121} y={33} />

        <Card suit={CLUB} rank={1} x={1} y={49} />
        <Card suit={CLUB} rank={2} x={11} y={49} />
        <Card suit={CLUB} rank={3} x={21} y={49} />
        <Card suit={CLUB} rank={4} x={31} y={49} />
        <Card suit={CLUB} rank={5} x={41} y={49} />
        <Card suit={CLUB} rank={6} x={51} y={49} />
        <Card suit={CLUB} rank={7} x={61} y={49} />
        <Card suit={CLUB} rank={8} x={71} y={49} />
        <Card suit={CLUB} rank={9} x={81} y={49} />
        <Card suit={CLUB} rank={10} x={91} y={49} />
        <Card suit={CLUB} rank={11} x={101} y={49} />
        <Card suit={CLUB} rank={12} x={111} y={49} />
        <Card suit={CLUB} rank={13} x={121} y={49} />
      </svg>
    </>
  );
};
