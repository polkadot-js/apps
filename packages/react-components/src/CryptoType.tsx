// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';

import { classes } from './util';

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
    <div className={classes('ui--CryptoType', className)}>
      {label}{type}
    </div>
  );
}

export default React.memo(CryptoType);
