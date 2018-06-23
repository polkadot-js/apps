// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

export default function isEqual <T> (a?: T, b?: T): boolean {
  return JSON.stringify({ test: a }) === JSON.stringify({ test: b });
}
