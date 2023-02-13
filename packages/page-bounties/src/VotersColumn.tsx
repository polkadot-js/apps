// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall, Icon } from '@polkadot/react-components';

import { getProposalToDisplay } from './helpers/extendedStatuses';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  option: 'ayes' | 'nays';
  proposals: DeriveCollectiveProposal[];
  status: BountyStatus;
}

const icons: Record<string, IconName> = {
  ayes: 'check',
  nays: 'times'
} as const;

function VotersColumn ({ className, option, proposals, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const proposal = useMemo(() => getProposalToDisplay(proposals, status), [proposals, status]);
  const votes = useMemo(() => option === 'ayes' ? proposal?.votes?.ayes : proposal?.votes?.nays, [proposal, option]);

  const voters = useMemo(() => votes?.map((accountId) =>
    <div
      className='voter'
      data-testid={`voters_${option}_${accountId.toString()}`}
      key={accountId.toString()}
    >
      <AddressSmall value={accountId} />
    </div>),
  [option, votes]);

  return (
    <>
      {proposal &&
        <StyledDiv className={className}>
          <div className='vote-numbers'>
            <span className='vote-numbers-icon'><Icon icon={icons[option]} /></span>
            <span className='vote-numbers-label'>
              {option === 'ayes' && t<string>('Aye: {{count}}', { replace: { count: votes ? votes.length : 0 } })}
              {option === 'nays' && t<string>('Nay: {{count}}', { replace: { count: votes ? votes.length : 0 } })}
            </span>
          </div>
          {voters}
        </StyledDiv>
      }
    </>
  );
}

const StyledDiv = styled.div`
  width: 50%;

  .vote-numbers {
    display: flex;
    align-items: center;
    margin-bottom: 0.85rem;
  }

  .vote-numbers-icon svg {
    max-width: 10px;
    color: var(--color-label);
  }

  .vote-numbers-label {
    margin-left: 0.75rem;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-tiny);
    line-height: 0.85rem;
    text-transform: uppercase;
    color: var(--color-label);
  }
`;

export default React.memo(VotersColumn);
