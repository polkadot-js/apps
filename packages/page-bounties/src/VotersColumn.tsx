// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

const icons = {
  ayes: 'check',
  nays: 'times'
};

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
      <AddressSmall value={accountId}/>
    </div>),
  [option, votes]);

  return (
    <>
      {proposal &&
        <div className={className}>
          <div className='vote-numbers'>
            <span className='vote-numbers-icon'><Icon icon={icons[option]} /></span>
            <span className='vote-numbers-label'>
              {option === 'ayes' && t('Aye: {{count}}', { replace: { count: votes ? votes.length : 0 } })}
              {option === 'nays' && t('Nay: {{count}}', { replace: { count: votes ? votes.length : 0 } })}
            </span>
          </div>
          {voters}
        </div>}
    </>
  );
}

export default React.memo(styled(VotersColumn)`
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
    font-weight: bold;
    font-size: 0.7rem;
    line-height: 0.85rem;
    text-transform: uppercase;
    color: var(--color-label);
  }
`);
