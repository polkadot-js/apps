export function* map<T, U>(iter: IterableIterator<T>, fn: (item: T) => U): IterableIterator<U> {
  for (const item of iter) {
    yield fn(item);
  }
}

export function* chain<T>(a: IterableIterator<T>, b: IterableIterator<T>): IterableIterator<T> {
  yield* a;
  yield* b;
}

export function* zip<T, U>(a: IterableIterator<T>, b: IterableIterator<U>): IterableIterator<[T, U]> {
  let itemA = a.next();
  let itemB = b.next();

  while (!itemA.done && !itemB.done) {
    yield [itemA.value, itemB.value];

    itemA = a.next();
    itemB = b.next();
  }
}

export function* take<T>(iter: IterableIterator<T>, n: number): IterableIterator<T> {
  for (const item of iter) {
    if (n-- === 0) {
      return;
    }

    yield item;
  }
}

export function skip<T>(iter: IterableIterator<T>, n: number): IterableIterator<T> {
  while (n-- !== 0 && !iter.next().done) {}

  return iter;
}

export function reduce<T, R>(iter: IterableIterator<T>, fn: (accu: R, item: T) => R, accumulator: R): R {
  for (const item of iter) {
    accumulator = fn(accumulator, item);
  }

  return accumulator;
}

export function join(iter: IterableIterator<{ toString: () => string }>, glue: string): string {
  const first = iter.next();

  if (first.done) {
    return '';
  }

  let result = first.value.toString();

  for (const item of iter) {
    result += glue + item;
  }

  return result;
}
