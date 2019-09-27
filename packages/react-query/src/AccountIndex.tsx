/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex } from '@polkadot/types/interfaces';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: string | null;
  accounts_idAndIndex?: [AccountId?, AccountIndex?];
}

export function AccountIndexDisplay ({ children, className, label = '', style, accounts_idAndIndex }: Props): React.ReactElement<Props> {
  const [, accountIndex] = accounts_idAndIndex || [];

  return (
    <div
      className={className}
      style={style}
    >
      {label}{
        accountIndex
          ? accountIndex.toString()
          : '-'
      }{children}
    </div>
  );
}

export default withCalls<Props>(
  ['derive.accounts.idAndIndex', { paramName: 'params' }]
)(AccountIndexDisplay);
