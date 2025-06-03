export const randomRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const shuffledArray = <T>(array: readonly T[]): readonly T[] => {
  const newArray = Array.from<T>({ length: array.length });
  for (let index = 0; index < array.length; index++) {
    const randomIndex = randomRange(0, index + 1);
    if (index !== randomIndex) {
      newArray[index] = newArray[randomIndex] as T;
    }
    newArray[randomIndex] = array[index] as T;
  }

  return newArray;
};
