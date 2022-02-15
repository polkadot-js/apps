// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { useBounties } from '@polkadot/app-bounties/hooks';
import { TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { isClaimable } from '../helpers';
import { useTranslation } from '../translate';

interface Props {
  beneficiaryId: AccountId;
  index: BountyIndex;
  payoutDue: BN;
}

function BountyClaimAction ({ beneficiaryId, index, payoutDue }: Props) {
  const { t } = useTranslation();
  const { claimBounty } = useBounties();
  const { allAccounts } = useAccounts();

  const isBountyClaimable = useMemo(
    () => isClaimable(allAccounts, beneficiaryId, payoutDue),
    [allAccounts, beneficiaryId, payoutDue]
  );

  return isBountyClaimable
    ? (
      <TxButton
        accountId={beneficiaryId}
        icon='plus'
        label={t<string>('Claim')}
        params={[index]}
        tx={claimBounty}
      />
    )
    : null;
}

export default React.memo(BountyClaimAction);
