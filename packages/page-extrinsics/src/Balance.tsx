// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { InputBalance } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  label?: React.ReactNode;
  params?: any;
}

function BalanceDisplay ({ className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [params]);

  return (
    <InputBalance
      className={className}
      defaultValue={allBalances?.freeBalance}
      isDisabled
      label={label}
    />
  );
}

export default React.memo(BalanceDisplay);
