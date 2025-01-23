// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isReferenda?: boolean;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function BalanceVoting ({ children, className = '', isReferenda, label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={isReferenda && api.query.convictionVoting && allBalances ? allBalances.votingBalance.add(allBalances.reservedBalance) : allBalances?.votingBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceVoting);
