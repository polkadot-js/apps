// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

export default function toShortAddress (_address?: AccountId | AccountIndex | Address | string | null | Uint8Array): string {
  const address = (_address || '').toString();

  return (address.length > 31)
    ? `${address.slice(0, 15)}…${address.slice(-15)}`
    : address;
}
