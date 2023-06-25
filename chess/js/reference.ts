type Reference<T> = {
  value: T | undefined;
  setValue: (value: T) => void;
};

export const createReference = <T>(): Reference<T> => {
  const object: Reference<T> = {
    value: undefined,
    setValue(value: T) {
      object.value = value;
    },
  };

  return object;
};
