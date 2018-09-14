// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

export default function isNonNumeric (key: string): boolean {
  const digits = new Array(9).join().split(',').map((item, index) => String(++index));

  return !digits.includes(key);
}
