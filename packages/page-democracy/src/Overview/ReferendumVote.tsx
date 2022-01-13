// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveReferendumVote } from '@polkadot/api-derive/types';
import type { Vote } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressMini } from '@polkadot/react-components';

interface Props {
  vote: DeriveReferendumVote;
}

const sizing = ['0.1x', '1x', '2x', '3x', '4x', '5x', '6x'];

function voteLabel ({ conviction }: Vote, isDelegating: boolean): string {
  return `${sizing[conviction.toNumber()]}${isDelegating ? '/d' : ''} - `;
}

function ReferendumVote ({ vote: { accountId, balance, isDelegating, vote } }: Props): React.ReactElement<Props> {
  return (
    <AddressMini
      balance={balance}
      labelBalance={voteLabel(vote, isDelegating)}
      value={accountId}
      withBalance
    />
  );
}

export default React.memo(ReferendumVote);
