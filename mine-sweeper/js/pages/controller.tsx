type ControllerProperties = {
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setMineAmount: (amount: number) => void;
};

export const Controller = (properties: ControllerProperties) => {
  return <div onClick={() => properties.setHeight(10)}>click</div>;
};
