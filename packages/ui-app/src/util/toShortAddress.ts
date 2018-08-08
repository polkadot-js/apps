// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

export default function toShortAddress (address: string): string {
  return `${address.slice(0, 7)}…${address.slice(-7)}`;
}
