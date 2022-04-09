// https://github.com/ronami/meta-typing
// Decreases a number's value by 1. For example, Dec<3> should return 2.
//
// This function is implemented as a truth table Since TypeScript's type system has no
// support for arithmetic. Because of that, it will return `never` for values bigger
// than 10 or smaller than 0.
//
//
// See https://en.wikipedia.org/wiki/Truth_table.
interface DecTable {
  10: 9;
  9: 8;
  8: 7;
  7: 6;
  6: 5;
  5: 4;
  4: 3;
  3: 2;
  2: 1;
  1: 0;
}
export type Dec<T extends number> =
  // Check `T`'s value on every number from 10 to 1 and return the previous value each time.
  // If it's out of scope, just return `never`.
  T extends keyof DecTable ? DecTable[T] : never;
