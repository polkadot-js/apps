// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { getAccountCryptoType } from './util/index.js';
import { AccountIdIsh } from './types.js';

interface Props {
  accountId: AccountIdIsh;
  className?: string;
  label?: string;
}

function CryptoType ({ accountId, className = '', label = '' }: Props): React.ReactElement<Props> {
  const [type, setType] = useState('unknown');

  useEffect((): void => {
    const result = getAccountCryptoType(accountId);

    if (result !== 'unknown') {
      setType(result);
    }
  }, [accountId]);

  return (
    <div className={`${className} ui--CryptoType`}>
      {label}{type}
    </div>
  );
}

export default React.memo(CryptoType);
