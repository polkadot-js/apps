// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex } from '@polkadot/types/interfaces';

import React, { useState, useEffect } from 'react';
import { withCalls } from '@polkadot/react-api';
import { getAddressName } from '@polkadot/react-components/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  defaultName?: string;
  idAndIndex?: [AccountId?, AccountIndex?];
  info?: DeriveAccountInfo;
  label?: React.ReactNode;
  params?: string | null;
  withShort?: boolean;
}

const nameCache: Map<string, string> = new Map();

function defaultOrAddr (defaultName = '', _address?: AccountId | string | null, _accountIndex?: AccountIndex): string {
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

export function AccountName ({ children, className, defaultName, idAndIndex, info, label = '', params, style }: Props): React.ReactElement<Props> {
  const [name, setName] = useState(defaultOrAddr(defaultName, params));

  useEffect((): void => {
    const [accountId, accountIndex] = idAndIndex || [];

    if (info && info.nickname) {
      const name = info.nickname.toUpperCase();

      nameCache.set(params || '', name);
      setName(name);
    } else {
      setName(defaultOrAddr(defaultName, accountId || params, accountIndex));
    }
  }, [idAndIndex, info]);

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
  ['derive.accounts.idAndIndex', { paramName: 'params', propName: 'idAndIndex' }],
  ['derive.accounts.info', { paramName: 'params', propName: 'info' }]
)(AccountName);
