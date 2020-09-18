// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

function flatten (key: string | null, value?: unknown): unknown {
  if (!value) {
    return value;
  }

  if ((value as Record<string, unknown>).$$typeof) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item) => flatten(null, item));
  }

  return value;
}

export default function isEqual <T> (a?: T, b?: T, debug = false): boolean {
  const jsonA = JSON.stringify({ test: a }, flatten);
  const jsonB = JSON.stringify({ test: b }, flatten);

  if (debug) {
    console.log('jsonA', jsonA, 'jsonB', jsonB);
  }

  return jsonA === jsonB;
}
