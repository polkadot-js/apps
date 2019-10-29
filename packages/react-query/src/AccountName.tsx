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

function defaultOrAddr (defaultName = '', address?: string | null): string {
  const [,, extracted] = getAddressName(address || '', null, defaultName);

  return extracted;
}

export function AccountName ({ children, className, defaultName, idAndIndex, info, label = '', params, style }: Props): React.ReactElement<Props> {
  const [name, setName] = useState<React.ReactNode>(defaultOrAddr(defaultName, params));

  useEffect((): void => {
    const [accountId, accountIndex] = idAndIndex || [];

    if (info && info.nickname) {
      setName(info.nickname.toUpperCase());
    } else if (accountId) {
      const [isAddress, , extracted] = getAddressName(accountId.toString());

      setName(
        isAddress
          ? (accountIndex && accountIndex.toString()) || extracted
          : extracted
      );
    } else {
      setName(defaultOrAddr(defaultName, params));
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
