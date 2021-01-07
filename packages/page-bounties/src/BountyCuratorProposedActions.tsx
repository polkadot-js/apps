// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  curatorId: AccountId;
  index: number;
}

function BountyCuratorProposedActions ({ curatorId, index }: Props) {
  const { t } = useTranslation();
  const { api } = useApi();
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
          tx={(api.tx.bounties || api.tx.treasury).acceptCurator}
        />
        <TxButton
          accountId={curatorId}
          icon='times'
          label={t<string>('Reject')}
          params={[index]}
          tx={(api.tx.bounties || api.tx.treasury).unassignCurator}
        />
      </>
    )
    : null;
}

export default React.memo(BountyCuratorProposedActions);
