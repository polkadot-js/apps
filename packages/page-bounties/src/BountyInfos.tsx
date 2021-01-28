// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';

import { useTranslation } from '@polkadot/app-bounties/translate';
import { AddressSmall } from '@polkadot/react-components';

import VotingSummary from './Voting/VotingSummary';
import BountyInfo from './BountyInfo';
import Description from './Description';

interface Props {
  beneficiary?: AccountId;
  blocksUntilUpdate?: BN;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

export const BLOCKS_TO_SHOW_WARNING = new BN('10000');

function BountyInfos ({ beneficiary, blocksUntilUpdate, proposals, status }: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      {proposals && (
        <VotingSummary
          proposals={proposals}
          status={status}
        />
      )}
      {beneficiary && (
        <div>
          <AddressSmall value={beneficiary} />
          <Description description={t<string>('Beneficiary')} />
        </div>
      )}
      {blocksUntilUpdate?.lt(BLOCKS_TO_SHOW_WARNING) && (
        <BountyInfo
          description={t<string>('Close deadline')}
          type='warning'
        />
      )}
      {status.isApproved && (
        <BountyInfo
          description={t<string>('Waiting for Bounty Funding')}
          type='info'
        />
      )}
      {status.isCuratorProposed && (
        <BountyInfo
          description={t<string>('Waiting for Curator acceptance')}
          type='info'
        />
      )}
    </>
  );
}

export default React.memo(BountyInfos);
