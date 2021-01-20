// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import React, { useEffect, useState } from 'react';

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import keyring from '@polkadot/ui-keyring';

import { BareProps } from './types';

interface Props extends BareProps {
  accountId: AccountId | AccountIndex | Address | string | Uint8Array | null;
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
