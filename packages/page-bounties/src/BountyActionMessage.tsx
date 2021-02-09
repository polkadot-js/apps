// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';

import { BN_HUNDRED, BN_ZERO } from '@polkadot/util';

import BountyInfo from './BountyInfos/BountyInfo';
import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  blocksUntilUpdate?: BN;
  status: BountyStatus;
}

export const BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING = 10;
const BLOCKS_LEFT_TO_SHOW_WARNING = new BN('10000');

function BountyActionMessage ({ blocksUntilUpdate, status }: Props): JSX.Element {
  const { t } = useTranslation();

  const { bountyUpdatePeriod } = useBounties();

  const blocksPercentageLeftToShowWarning = bountyUpdatePeriod?.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).div(BN_HUNDRED);
  const blocksToShowWarning = blocksPercentageLeftToShowWarning ?? BLOCKS_LEFT_TO_SHOW_WARNING;

  return (
    <div>
      {blocksUntilUpdate?.lte(BN_ZERO) && (
        <BountyInfo
          description={t<string>('Update overdue')}
          type='warning'
        />
      )}
      {blocksUntilUpdate?.lt(blocksToShowWarning) && blocksUntilUpdate?.gt(BN_ZERO) && (
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
          description={t<string>("Waiting for Curator's acceptance")}
          type='info'
        />
      )}
    </div>
  );
}

export default React.memo(BountyActionMessage);
