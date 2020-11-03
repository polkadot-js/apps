// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import React from 'react';
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { InputBalance } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

interface Props extends BareProps {
  label?: React.ReactNode;
  params?: any;
}

export default function BalanceDisplay ({ className, label, params, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all as any, [params]);

  return (
    <InputBalance
      className={className}
      isDisabled
      label={label}
      style={style}
      defaultValue={allBalances?.freeBalance}
    />
  );
}
