// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

export function toShortAddress (_address?: AccountId | AccountIndex | Address | string | null | Uint8Array): string {
  const address = (_address || '').toString();

  return (address.length > 11)
    ? `${address.slice(0, 5)}…${address.slice(-5)}`
    : address;
}
