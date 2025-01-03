// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

function flatten (_key: string | null, value?: unknown): unknown {
  return !value
    ? value
    : (value as Record<string, unknown>).$$typeof
      ? ''
      : Array.isArray(value)
        ? value.map((item) => flatten(null, item))
        : value;
}

export function isEqual <T> (a?: T, b?: T): boolean {
  return JSON.stringify({ test: a }, flatten) === JSON.stringify({ test: b }, flatten);
}
