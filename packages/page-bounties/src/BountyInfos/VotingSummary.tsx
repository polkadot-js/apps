// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import VotingDescriptionInfo from '@polkadot/app-bounties/BountyInfos/VotingDescriptionInfo';
import { useCollectiveMembers } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import VotingLink from './VotingLink';

interface Props {
  className?: string;
  proposal: DeriveCollectiveProposal;
  status: BountyStatus;
}

function VotingSummary ({ className, proposal, status }: Props): JSX.Element {
  const { members } = useCollectiveMembers('council');
  const { t } = useTranslation();
  const ayes = useMemo(() => proposal?.votes?.ayes?.length, [proposal]);
  const nays = useMemo(() => proposal?.votes?.nays?.length, [proposal]);
  const threshold = useMemo(() => proposal?.votes?.threshold.toNumber(), [proposal]);
  const nayThreshold = useMemo(() => members?.length && threshold ? (members.length - threshold + 1) : 0, [members, threshold]);

  return (
    <>
      {proposal && (
        <div
          className={className}
          data-testid='voting-summary'
        >
          <div className='voting-summary-text'><span>{t('Aye')}</span> <b>{ayes}/{threshold}</b></div>
          <div className='voting-summary-text'><span>{t('Nay')}</span> <b>{nays}/{nayThreshold}</b></div>
          <div className='link-info'>
            <VotingLink/>
            <VotingDescriptionInfo
              proposal={proposal}
              status={status}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(styled(VotingSummary)`
  .voting-summary-text {
    font-size: 0.85rem;
    line-height: 1.5rem;
    color: var(--color-label);

    span {
      min-width: 0.5rem;
      margin-right: 0.5rem;
    }
  }

  .link-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.5rem;
  }
`);
