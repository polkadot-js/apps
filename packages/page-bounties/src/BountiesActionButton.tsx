// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { getBountyStatus, isClaimable } from './helpers';
import { useTranslation } from './translate';

interface Props {
  bestNumber: BlockNumber;
  index: number;
  status: BountyStatus;
}

export function BountiesActionButton ({ bestNumber, index, status }: Props): JSX.Element | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();

  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, bountyStatus, curator, unlockAt } = updateStatus();

  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  const isBountyClaimable = useMemo(
    () => beneficiary && blocksUntilPayout && isClaimable(allAccounts, beneficiary, blocksUntilPayout),
    [allAccounts, beneficiary, blocksUntilPayout]
  );

  const isCurator = useMemo(() => curator && allAccounts.includes(curator.toString()), [allAccounts, curator]);

  return (
    <>
      {
        bountyStatus === 'Curator Proposed' && hasAccounts && isCurator &&
        <>
          <TxButton
            accountId={curator}
            icon='check'
            label={t<string>('Accept')}
            params={[index]}
            tx={(api.tx.bounties || api.tx.treasury).acceptCurator}
          />
          <TxButton
            accountId={curator}
            icon='times'
            label={t<string>('Reject')}
            params={[index]}
            tx={(api.tx.bounties || api.tx.treasury).unassignCurator}
          />
        </>
      }
      {
        bountyStatus === 'Pending Payout' && hasAccounts && isBountyClaimable &&
        <TxButton
          accountId={beneficiary}
          icon='plus'
          label={t<string>('Claim')}
          params={[index]}
          tx={(api.tx.bounties || api.tx.treasury).claimBounty}
        />
      }
    </>
  );
}
