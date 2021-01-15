// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React from 'react';

import VotingSummary from './Voting/VotingSummary';

interface Props {
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

export function BountyInfos ({ proposals, status }: Props): JSX.Element {
  return (
    <>
      {proposals && (
        <VotingSummary
          proposals={proposals}
          status={status}
        />
      )}
    </>
  );
}
