// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountIdIsh } from '../../page-accounts/src/util';

import React, { useEffect, useState } from 'react';

import { GetAccountCryptoType } from '../../page-accounts/src/util';

interface Props {
  accountId: AccountIdIsh;
  className?: string;
  label?: string;
}

function CryptoType ({ accountId, className = '', label = '' }: Props): React.ReactElement<Props> {
  const [type, setType] = useState('unknown');

  useEffect((): void => {
    const result = GetAccountCryptoType(accountId);

    if (result !== 'unknown') {
      setType(result);
    }
  }, [accountId]);

  return (
    <div className={`ui--CryptoType ${className}`}>
      {label}{type}
    </div>
  );
}

export default React.memo(CryptoType);
