// Copyright 2017-2021 @polkadot/react-query authors & contributors
// and @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-api/types';
import { useApi, useCall } from '@canvas-ui/react-hooks';
import React from 'react';

import { Option } from '@polkadot/types';
import { AccountId, AccountIndex, Address, StakingLedger } from '@polkadot/types/interfaces';

import FormatBalance from './FormatBalance';

interface Props extends BareProps {
  children?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  label?: React.ReactNode;
}

function BondedDisplay ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const controllerId = useCall<AccountId | null>(api.query.staking.bonded, [params], {
    transform: (value: Option<AccountId>) => value.unwrapOr(null)
  });
  const stakingLedger = useCall<StakingLedger | null>(controllerId && api.query.staking.ledger, [controllerId], {
    transform: (value: Option<StakingLedger>) => value.unwrapOr(null)
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
