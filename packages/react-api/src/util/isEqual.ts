// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

function flatten (key: string | null, value: any): any {
  if (!value) {
    return value;
  }

  if (value.$$typeof) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item): any =>
      flatten(null, item)
    );
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
