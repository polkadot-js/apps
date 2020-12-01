// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isCouncil?: boolean;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function BalanceVoting ({ children, className = '', isCouncil, label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={isCouncil
        ? allBalances?.votingBalance.add(allBalances?.reservedBalance)
        : allBalances?.votingBalance
      }
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceVoting);
