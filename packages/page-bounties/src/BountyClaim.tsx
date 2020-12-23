// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';

import { TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { isClaimable } from './helpers/isClaimable';
import { useTranslation } from './translate';

interface Props {
  accounts: string[];
  beneficiaryId: string;
  index: number;
  payoutDue: BN;
}

function BountyClaim ({ accounts, beneficiaryId, index, payoutDue }: Props) {
  const { t } = useTranslation();
  const { api } = useApi();

  const [isValid] = useState(true);

  const isBountyClaimable = useCallback(() => isClaimable(accounts, beneficiaryId, payoutDue), [accounts, beneficiaryId, payoutDue]);

  return isBountyClaimable()
    ? <TxButton
      accountId={beneficiaryId}
      icon='plus'
      isDisabled={!isValid}
      label={t<string>('Claim Bounty')}
      params={[index]}
      tx={
        api.tx.bounties
          ? 'bounties.claimBounty'
          : 'treasury.claimBounty'
      }
    />
    : null;
}

export default React.memo(BountyClaim);
