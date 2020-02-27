// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import React from 'react';
// Commented for easy tracking while rebasing'
// import { useApi, useCall } from '@polkadot/react-hooks';
import FormatBalance from './FormatBalance';
import BN from 'bn.js';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

export default function TotalIssuance ({ children, className, label, style }: Props): React.ReactElement<Props> {
  // Commented for easy tracking while rebasing'
  // const { api } = useApi();
  // const totalIssuance = useCall<string>(api.query.balances.totalIssuance, []);
  const totalIssuance = new BN(0);
  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}
      <FormatBalance
        value={totalIssuance}
        withSi
      />
      {children}
    </div>
  );
}
