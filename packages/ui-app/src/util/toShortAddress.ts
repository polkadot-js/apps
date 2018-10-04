// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';

export default function toShortAddress (_address: AccountId | AccountIndex | Address | string): string {
  const address = _address.toString();

  return `${address.slice(0, 7)}…${address.slice(-7)}`;
}
