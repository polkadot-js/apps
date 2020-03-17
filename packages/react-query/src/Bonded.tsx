// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address, StakingLedger } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props extends BareProps {
  children?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  label?: React.ReactNode;
}

function BondedDisplay ({ children, className, label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const controllerId = useCall<AccountId | null>(api.query.staking.bonded, [params], {
    transform: (value): AccountId | null =>
      value.unwrapOr(null)
  });
  const stakingLedger = useCall<StakingLedger | null>(controllerId && api.query.staking.ledger, [controllerId], {
    transform: (value): StakingLedger | null =>
      value.unwrapOr(null)
  });

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
