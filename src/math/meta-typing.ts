/* eslint-disable no-use-before-define */
// https://github.com/ronami/meta-typing

// Decreases a number's value by 1. For example, Dec<3> should return 2.
//
// This function is implemented as a truth table Since TypeScript's type system has no
// support for arithmetic. Because of that, it will return `never` for values bigger
// than 10 or smaller than 0.

export type Dec<T extends number> =
  // Check `T`'s value on every number from 10 to 1 and return the previous value each time.
  // If it's out of scope, just return `never`.
  T extends keyof DecTable ? DecTable[T] : never;

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

// Increases a number's value by 1. For example, Inc<3> should return 4.
//
// This function is implemented as a truth table Since TypeScript's type system has no
// support for arithmetic. Because of that, it will return `never` for values bigger
// than 10 or smaller than 0.
//
// type S1 = Inc<3>; // 4
export type Inc<T extends number> =
  // Check `T`'s value on every number from 0 to 9 and return the next value each time.
  // If it's out of scope, just return `never`.
  T extends keyof IncTable ? IncTable[T] : never;

// See https://en.wikipedia.org/wiki/Truth_table.
interface IncTable {
  0: 1;
  1: 2;
  2: 3;
  3: 4;
  4: 5;
  5: 6;
  6: 7;
  7: 8;
  8: 9;
  9: 10;
}

// Adds two numbers: https://lodash.com/docs/4.17.15#add.

// type S = Add<6, 4>; // 10

// This type uses recursive (and not officially supported) type alias, see more:
// https://github.com/microsoft/TypeScript/issues/26223#issuecomment-513187373.
export type Add<
  // Accept two numbers two add together.
  A extends number,
  B extends number
> = {
  // If `B`'s value is 0 then we're done, just return `A`.
  finish: A;
  // Otherwise, call `Add` recursively while increasing `A`'s value by 1 and decreasing
  // `B`'s value by 1. Eventually, `B`'s value will be 0 and the recursion will terminate.
  next: Add<Inc<A>, Dec<B>>;
  // For example, Add<3, 2> will first translate into another `Add` call that will
  // increase `A`'s value by 1 and decrease `B`'s value by 1: Add<4, 1>.
  //
  // Then, since `B`'s value isn't 0 (it's 1), the recursion runs again: Add<5, 0>.
  //
  // Finally, now that `B`'s value is 0, the recursion terminates and returns the
  // accumulated value of `A` which is 5.
}[B extends 0 ? "finish" : "next"];
