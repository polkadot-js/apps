// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import Description from '@polkadot/app-bounties/Description';
import { getProposalToDisplay } from '@polkadot/app-bounties/helpers/extendedStatuses';
import { useTranslation } from '@polkadot/app-bounties/translate';
import { AddressSmall } from '@polkadot/react-components';

import VotingLink from './Voting/VotingLink';
import VotingSummary from './Voting/VotingSummary';

interface Props {
  beneficiary?: AccountId;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyInfos ({ beneficiary, proposals, status }: Props): JSX.Element {
  const { t } = useTranslation();
  const proposalToDisplay = useMemo(() => proposals && getProposalToDisplay(proposals, status), [proposals, status]);

  return (
    <>
      {proposalToDisplay && <VotingSummary proposal={proposalToDisplay}/>}
      {proposalToDisplay && <VotingLink />}
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
