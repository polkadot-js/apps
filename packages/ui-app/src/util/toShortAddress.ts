// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';

export default function toShortAddress (_address?: AccountId | AccountIndex | Address | string | null): string {
  const address = (_address || '').toString();

  return (address.length > 15)
    ? `${address.slice(0, 7)}…${address.slice(-7)}`
    : address;
}
