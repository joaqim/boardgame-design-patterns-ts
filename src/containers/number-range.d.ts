type Mapped<
  N extends number,
  Result extends unknown[] = []
> = Result["length"] extends N
  ? Result
  : Mapped<N, [...Result, Result["length"]]>;

// 0 , 1, 2 ... 16
export type NumberRange<TSize extends number = 16> = Mapped<TSize>[number];
