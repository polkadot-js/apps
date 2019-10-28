/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address, BalanceOf } from '@polkadot/types/interfaces';

import React from 'react';

import { withCalls } from '@polkadot/react-api';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  electionsPhragmen_stakeOf?: BalanceOf;
}

export function LockedVote ({ children, className, electionsPhragmen_stakeOf, label = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {label}{
        electionsPhragmen_stakeOf
          ? formatBalance(electionsPhragmen_stakeOf)
          : '-'
      }{children}
    </div>
  );
}

export default withCalls<Props>(
  ['query.electionsPhragmen.stakeOf', { paramName: 'params' }]
)(LockedVote);
