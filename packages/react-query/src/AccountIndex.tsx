// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Address } from '@polkadot/types/interfaces';
import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';

import React, { useState, useEffect } from 'react';
import { useApi, trackStream } from '@polkadot/react-hooks';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultValue?: string;
  label?: React.ReactNode;
  params?: string | AccountId | Address | null;
}

export default function AccountIndexDisplay ({ children, className, defaultValue = '-', label = '', params, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = trackStream<DeriveAccountInfo>(api.derive.accounts.info as any, [params]);
  const [accountIndex, setAccountIndex] = useState<string | null>(null);

  useEffect((): void => {
    const { accountIndex } = info || {};

    if (accountIndex) {
      setAccountIndex(accountIndex.toString());
    }
  }, [info]);

  return (
    <div
      className={className}
      style={style}
    >
      {label}{accountIndex || defaultValue}{children}
    </div>
  );
}
