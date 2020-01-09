/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address, StakingLedger } from '@polkadot/types/interfaces';

import React from 'react';

import { withCalls } from '@polkadot/react-api/hoc';

import FormatBalance from './FormatBalance';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  label?: React.ReactNode;
  staking_ledger?: StakingLedger | null;
}

export function BondedDisplay ({ children, className, label, staking_ledger }: Props): React.ReactElement<Props> {
  return (
    <FormatBalance
      className={className}
      label={label}
      value={staking_ledger && staking_ledger.active}
    >
      {children}
    </FormatBalance>
  );
}

export default withCalls<Props>(
  ['query.staking.bonded', {
    paramName: 'params',
    propName: 'controllerId',
    transform: (value): AccountId | null =>
      value.unwrapOr(null)
  }],
  ['query.staking.ledger', {
    paramName: 'controllerId',
    transform: (value): StakingLedger | null =>
      value.unwrapOr(null)
  }]
)(BondedDisplay);
