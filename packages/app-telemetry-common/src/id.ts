import { Opaque } from './helpers';

/**
 * Unique type-constrained Id number.
 */
export type Id<T> = Opaque<number, T>;

/**
 * Higher order function producing new auto-incremented `Id`s.
 */
export function idGenerator<I extends Id<any>> (): () => I {
  let current = 0;

  return () => current++ as I;
}
