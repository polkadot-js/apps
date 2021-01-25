// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyStatus } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import Description from '@polkadot/app-bounties/Description';
import { useTranslation } from '@polkadot/app-bounties/translate';
import { AddressSmall } from '@polkadot/react-components';

import VotingSummary from './Voting/VotingSummary';

interface Props {
  beneficiary?: AccountId;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyInfos ({ beneficiary, proposals, status }: Props): JSX.Element {
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
    </>
  );
}

export default React.memo(styled(BountyInfos)`
  
`);
