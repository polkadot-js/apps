// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { useBounties } from '@polkadot/app-bounties/hooks';
import { TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  curatorId: AccountId;
  index: BountyIndex;
}

function BountyCuratorProposedActions ({ curatorId, index }: Props) {
  const { t } = useTranslation();
  const { acceptCurator, unassignCurator } = useBounties();
  const { allAccounts } = useAccounts();

  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  return isCurator
    ? (
      <>
        <TxButton
          accountId={curatorId}
          icon='check'
          label={t<string>('Accept')}
          params={[index]}
          tx={acceptCurator}
        />
        <TxButton
          accountId={curatorId}
          icon='times'
          label={t<string>('Reject')}
          params={[index]}
          tx={unassignCurator}
        />
      </>
    )
    : null;
}

export default React.memo(BountyCuratorProposedActions);
