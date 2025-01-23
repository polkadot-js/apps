// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, AccountIndex, Address, StakingLedger } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  label?: React.ReactNode;
}

const OPT_C = {
  transform: (value: Option<AccountId>) => value.unwrapOr(null)
};

const OPT_L = {
  transform: (value: Option<StakingLedger>) => value.unwrapOr(null)
};

function BondedDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const controllerId = useCall<AccountId | null>(api.query.staking?.bonded, [params], OPT_C);
  const stakingLedger = useCall<StakingLedger | null>(controllerId && api.query.staking?.ledger, [controllerId], OPT_L);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={stakingLedger?.active}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BondedDisplay);
