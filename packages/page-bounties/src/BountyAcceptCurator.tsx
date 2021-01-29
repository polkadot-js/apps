// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  curatorId: AccountId;
  index: BountyIndex;
}

function BountyAcceptCurator ({ curatorId, index }: Props) {
  const { t } = useTranslation();
  const { acceptCurator } = useBounties();
  const { allAccounts } = useAccounts();

  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  return (
    <>
      {isCurator &&
        <TxButton
          accountId={curatorId}
          icon='check'
          label={t<string>('Accept')}
          params={[index]}
          tx={acceptCurator}
        />
      }
    </>
  );
}

export default React.memo(BountyAcceptCurator);
