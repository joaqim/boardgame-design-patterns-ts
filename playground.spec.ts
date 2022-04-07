import { FixedArray } from "./src/containers";

/*
export const fromArrayToFixedArray = <TSize extends number, T, A extends T[]>(
  length: TSize,
  ...content: A
): FixedArray<TSize, TData> => Array.from({ length, ...content });
*/


/*
export const fromArrayToFixedArray = <TSize extends number, T, A extends T[]>(
  length: TSize,
  ...content: A
): FixedArray<TSize, TData> => Array.from({ length, ...content });
*/

/*
export const toFixedArray = <N extends number, T = number>(
  array: T[]
): FixedArray<N, T> => <FixedArray<TSize, number | null>>[...array];
*/

const realFixed: FixedArray<3> = [1, 2, 3];
realFixed[1] = 1;

// GrowToSize<T, array, N>[...array];

const toFixedArray = <TSize extends number, T = number | null>(
  array: T[]
): FixedArray<TSize, T> => <FixedArray<TSize, T>>[...array];

const array = [1, 4];
const arrayFixed = toFixedArray<1>(array);

array[1] = 1;
array[8] = 1;

//arrayFixed[1] = 10;