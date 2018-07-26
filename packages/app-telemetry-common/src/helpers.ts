import { Milliseconds, Timestamp } from './types';

/**
 * PhantomData akin to Rust, because sometimes you need to be smarter than
 * the compiler.
 */
export abstract class PhantomData<P> { public __PHANTOM__!: P; }

/**
 * Opaque type, similar to `opaque type` in Flow, or new types in Rust/C.
 * These should be produced only by manually casting `t as Opaque<T, P>`.
 *
 * `P` can be anything as it's never actually used. Using strings is okay:
 *
 * ```
 * type MyType = Opaque<number, 'MyType'>;
 * ```
 */
export type Opaque<T, P> = T & PhantomData<P>;

/**
 * Just a readable shorthand for null-ish-able types, akin to `T?` in Flow.
 */
export type Maybe<T> = T | null | undefined;

/**
 * Asynchronous sleep
 */
export function sleep (time: Milliseconds): Promise<void> {
  return new Promise<void>((resolve, _reject) => {
    setTimeout(() => resolve(), time);
  });
}

export const timestamp = Date.now as () => Timestamp;

export function noop () {}
