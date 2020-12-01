// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import keyring from '@polkadot/ui-keyring';

interface Props {
  accountId: AccountId | AccountIndex | Address | string | Uint8Array | null;
  className?: string;
  label?: string;
}

function CryptoType ({ accountId, className = '', label = '' }: Props): React.ReactElement<Props> {
  const [type, setType] = useState('unknown');

  useEffect((): void => {
    try {
      const current = accountId
        ? keyring.getPair(accountId.toString())
        : null;

      if (current) {
        setType(
          current.meta.isInjected
            ? 'injected'
            : current.meta.isHardware
              ? current.meta.hardwareType as string || 'hardware'
              : current.meta.isExternal
                ? current.meta.isMultisig
                  ? 'multisig'
                  : current.meta.isProxied
                    ? 'proxied'
                    : 'external'
                : current.type
        );
      }
    } catch (error) {
      // cannot determine, keep unknown
    }
  }, [accountId]);

  return (
    <div className={`ui--CryptoType ${className}`}>
      {label}{type}
    </div>
  );
}

export default React.memo(CryptoType);
