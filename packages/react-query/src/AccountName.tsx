// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useState, useEffect } from 'react';
import { withCalls } from '@polkadot/react-api';
import { getAddressName } from '@polkadot/react-components/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  defaultName?: string;
  info?: DeriveAccountInfo;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | null;
  withShort?: boolean;
}

const nameCache: Map<string, string> = new Map();

function defaultOrAddr (defaultName = '', _address?: AccountId | AccountIndex | Address | string | null, _accountIndex?: AccountIndex): string {
  const accountId = (_address || '').toString();
  const cached = nameCache.get(accountId);

  if (cached) {
    return cached;
  }

  const accountIndex = (_accountIndex || '').toString();
  const [isAddress,, extracted] = getAddressName(accountId, null, defaultName);

  if (isAddress && accountIndex) {
    nameCache.set(accountId, accountIndex);

    return accountIndex;
  }

  return extracted;
}

export function AccountName ({ children, className, defaultName, info, label = '', params, style }: Props): React.ReactElement<Props> {
  const [name, setName] = useState(defaultOrAddr(defaultName, params));

  useEffect((): void => {
    const { accountId, accountIndex, nickname } = info || {};

    if (nickname) {
      const name = nickname.toUpperCase();

      nameCache.set((params || '').toString(), name);
      setName(name);
    } else {
      setName(defaultOrAddr(defaultName, accountId || params, accountIndex));
    }
  }, [info]);

  return (
    <div
      className={className}
      style={style}
    >
      {label}{name}{children}
    </div>
  );
}

export default withCalls<Props>(
  ['derive.accounts.info', { paramName: 'params', propName: 'info' }]
)(AccountName);
