// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React from 'react';

import VotingDescription from '@polkadot/app-bounties/VotingDescription';

type Props = {
  bountyStatus: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyStatusDisplay ({ bountyStatus, proposals, status }: Props) {
  return (
    <div>
      <div>{bountyStatus}</div>
      {proposals && (
        <div>
          <VotingDescription
            proposals={proposals}
            status={status}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(BountyStatusDisplay);
