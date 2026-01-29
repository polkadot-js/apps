// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { AddressSmall } from '@polkadot/react-components';

import Description from '../Description.js';
import { getProposalToDisplay } from '../helpers/extendedStatuses.js';
import { useTranslation } from '../translate.js';
import VotingSummary from './VotingSummary.js';

interface Props {
  beneficiary?: AccountId;
  proposals?: DeriveCollectiveProposal[];
  status: PalletBountiesBountyStatus;
}

function BountyInfos ({ beneficiary, proposals, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const proposalToDisplay = useMemo(() => proposals && getProposalToDisplay(proposals, status), [proposals, status]);

  return (
    <>
      {proposalToDisplay &&
        <VotingSummary
          proposal={proposalToDisplay}
          status={status}
        />
      }
      {beneficiary && (
        <div>
          <AddressSmall value={beneficiary} />
          <Description description={t('Beneficiary')} />
        </div>
      )}
    </>
  );
}

export default React.memo(BountyInfos);
