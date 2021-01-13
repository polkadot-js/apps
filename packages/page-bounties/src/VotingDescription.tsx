// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { getVotingDescription } from './helpers/extendedStatuses';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  proposals: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function VotingDescription ({ className = '', proposals, status }: Props): JSX.Element {
  const { t } = useTranslation();
  const description = getVotingDescription(proposals, status, t);

  return (
    <>
      {description && (
        <
          div className={className}
          data-testid='extendedStatus'
        >
          {description}
        </div>
      )}
    </>
  );
}

export default React.memo(styled(VotingDescription)`
    font-size: 0.7rem;
    color: #8B8B8B;
    margin-top: 10px;
`);
