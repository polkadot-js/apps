// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Address } from '@polkadot/types/interfaces';
import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  value?: string | AccountId | Address | null | Uint8Array;
}

function extractIndex ({ accountIndex }: Partial<DeriveAccountInfo> = {}): string | null {
  return accountIndex
    ? accountIndex.toString()
    : null;
}

function AccountIndex ({ children, className = '', defaultValue, label, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const info = useCall<DeriveAccountInfo>(api.derive.accounts.info, [value]);

  const accountIndex = useMemo(
    () => extractIndex(info),
    [info]
  );

  if (!api.query.indices) {
    return null;
  }

  return (
    <div className={`ui--AccountIndex ${className}`}>
      {label || ''}<div className='account-index'>{accountIndex || defaultValue || '-'}</div>{children}
    </div>
  );
}

export default React.memo(styled(AccountIndex)`
  .account-index {
    font-family: monospace;
  }
`);
