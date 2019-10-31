// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  info?: DeriveAccountInfo;
  label?: React.ReactNode;
  params?: string | null;
}

export function AccountIndexDisplay ({ children, className, info, label = '', style }: Props): React.ReactElement<Props> {
  const { accountIndex } = info || {};

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
  ['derive.accounts.info', { paramName: 'params' }]
)(AccountIndexDisplay);
