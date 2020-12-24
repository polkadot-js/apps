// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import { isClaimable } from './helpers';
import { useTranslation } from './translate';

interface Props {
  beneficiaryId: AccountId;
  index: number;
  payoutDue: BN;
}

function BountyClaim ({ beneficiaryId, index, payoutDue }: Props) {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();

  const isBountyClaimable = useMemo(() => isClaimable(allAccounts, beneficiaryId, payoutDue), [allAccounts, beneficiaryId, payoutDue]);

  return hasAccounts && isBountyClaimable
    ? (
      <TxButton
        accountId={beneficiaryId}
        icon='plus'
        label={t<string>('Claim Bounty')}
        params={[index]}
        tx={
          api.tx.bounties
            ? 'bounties.claimBounty'
            : 'treasury.claimBounty'
        }
      />
    )
    : null;
}

export default React.memo(BountyClaim);
