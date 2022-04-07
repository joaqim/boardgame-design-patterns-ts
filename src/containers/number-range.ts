type Enumerate<
  N extends number,
  Accumulator extends number[] = []
> = Accumulator["length"] extends N
  ? Accumulator[number]
  : Enumerate<N, [...Accumulator, Accumulator["length"]]>;

export type NumberRange<T extends number = 16> = Exclude<
  Enumerate<T>,
  Enumerate<0>
>;

// type T = NumberRange<20>
