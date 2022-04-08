// https://stackoverflow.com/a/70307091

type Enumerate<
  N extends number,
  Accumulator extends number[] = []
> = Accumulator["length"] extends N
  ? Accumulator[number]
  : Enumerate<N, [...Accumulator, Accumulator["length"]]>;

export type NumberRange<
  T extends number = 16,
  TStartOffset extends number = 0
> = Exclude<Enumerate<T>, Enumerate<TStartOffset>>;

// type T = NumberRange<20>
