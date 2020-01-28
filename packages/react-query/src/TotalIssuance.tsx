// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { Balance } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

export default function TotalIssuance ({ children, className, label, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalIssuance = useCall<string>(api.query.balances.totalIssuance, [], {
    transform: (totalIssuance: Balance): string =>
      totalIssuance?.toString()
  });

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{
        totalIssuance
          ? `${formatBalance(totalIssuance, { withSi: false })}${formatBalance.calcSi(totalIssuance).value}`
          : '-'
      }{children}
    </div>
  );
}
