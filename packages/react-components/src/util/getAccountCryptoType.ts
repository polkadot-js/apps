// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountIdIsh } from '../types.js';

import { keyring } from '@polkadot/ui-keyring';

export function getAccountCryptoType (accountId: AccountIdIsh): string {
  try {
    const current = accountId
      ? keyring.getPair(accountId.toString())
      : null;

    if (current) {
      return current.meta.isInjected
        ? 'injected'
        : current.meta.isHardware
          ? current.meta.hardwareType as string || 'hardware'
          : current.meta.isExternal
            ? current.meta.isMultisig
              ? 'multisig'
              : current.meta.isProxied
                ? 'proxied'
                : current.meta.isLocal
                  ? 'chopsticks'
                  : 'qr'
            : current.type;
    }
  } catch {
    // cannot determine, keep unknown
  }

  return 'unknown';
}
