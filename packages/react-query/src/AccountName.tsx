// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React, { useState, useEffect } from 'react';
import { getAddressName } from '@polkadot/react-components/util';
import { useStream, useApi } from '@polkadot/react-hooks';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultName?: string;
  label?: React.ReactNode;
  onClick?: () => void;
  override?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | null;
  toggle?: any;
  withShort?: boolean;
}

const nameCache: Map<string, string> = new Map();

function defaultOrAddr (defaultName = '', _address?: AccountId | AccountIndex | Address | string | null, _accountIndex?: AccountIndex | null): string {
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

export default function AccountName ({ children, className, defaultName, label = '', onClick, override, params, style, toggle, withShort }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useStream<DeriveAccountInfo>(api.derive.accounts.info as any, [params]);
  const [name, setName] = useState(defaultOrAddr(defaultName, params));

  useEffect((): void => {
    const { accountId, accountIndex, nickname } = info || {};

    if (nickname) {
      const name = nickname.toUpperCase();

      nameCache.set((params || '').toString(), name);
      setName(name);
    } else {
      setName(defaultOrAddr(defaultName, accountId || params, withShort ? null : accountIndex));
    }
  }, [info, toggle]);

  return (
    <div
      className={className}
      onClick={
        override
          ? undefined
          : onClick
      }
      style={style}
    >
      {label}{override || name}{children}
    </div>
  );
}
