// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { BN, BN_HUNDRED, BN_ZERO } from '@polkadot/util';

import { useBounties, useBountyStatus } from '../hooks/index.js';
import { useTranslation } from '../translate.js';
import BountyInfo from './BountyInfo.js';

interface Props {
  bestNumber: BN;
  blocksUntilUpdate?: BN;
  status: PalletBountiesBountyStatus;
}

export const BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING = 10;
const BLOCKS_LEFT_TO_SHOW_WARNING = new BN('10000');

function BountyActionMessage ({ bestNumber, blocksUntilUpdate, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { unlockAt } = useBountyStatus(status);
  const { bountyUpdatePeriod } = useBounties();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  const blocksPercentageLeftToShowWarning = bountyUpdatePeriod?.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).div(BN_HUNDRED);
  const blocksToShowWarning = blocksPercentageLeftToShowWarning ?? BLOCKS_LEFT_TO_SHOW_WARNING;

  return (
    <div>
      {blocksUntilUpdate?.lte(BN_ZERO) && (
        <BountyInfo
          description={t('Update overdue')}
          type='warning'
        />
      )}
      {blocksUntilUpdate?.lt(blocksToShowWarning) && blocksUntilUpdate?.gt(BN_ZERO) && (
        <BountyInfo
          description={t('Close deadline')}
          type='warning'
        />
      )}
      {status.isApproved && (
        <BountyInfo
          description={t('Waiting for Bounty Funding')}
          type='info'
        />
      )}
      {status.isCuratorProposed && (
        <BountyInfo
          description={t("Waiting for Curator's acceptance")}
          type='info'
        />
      )}
      {blocksUntilPayout?.lt(BN_ZERO) &&
        <BountyInfo
          description={t('Waiting for implementer to claim')}
          type='info'
        />
      }
    </div>
  );
}

export default React.memo(BountyActionMessage);
