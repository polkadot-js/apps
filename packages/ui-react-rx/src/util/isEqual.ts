// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
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
    return value.map((item) =>
      flatten(null, item)
    );
  }

  return value;
}

export default function isEqual <T> (a?: T, b?: T): boolean {
  return JSON.stringify({ test: a }, flatten) === JSON.stringify({ test: b }, flatten);
}
