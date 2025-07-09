// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';
import { useCollectiveMembers } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import VotingDescriptionInfo from './VotingDescriptionInfo.js';
import VotingLink from './VotingLink.js';

interface Props {
  className?: string;
  proposal: DeriveCollectiveProposal;
  status: PalletBountiesBountyStatus;
}

function VotingSummary ({ className, proposal, status }: Props): React.ReactElement<Props> {
  const { members } = useCollectiveMembers('council');
  const { t } = useTranslation();
  const ayes = useMemo(() => proposal?.votes?.ayes?.length, [proposal]);
  const nays = useMemo(() => proposal?.votes?.nays?.length, [proposal]);
  const threshold = useMemo(() => proposal?.votes?.threshold.toNumber(), [proposal]);
  const nayThreshold = useMemo(() => members?.length && threshold ? (members.length - threshold + 1) : 0, [members, threshold]);

  return (
    <>
      {proposal && (
        <StyledDiv
          className={className}
          data-testid='voting-summary'
        >
          <div className='voting-summary-text'><span>{t('Aye')}</span> <b>{ayes}/{threshold}</b></div>
          <div className='voting-summary-text'><span>{t('Nay')}</span> <b>{nays}/{nayThreshold}</b></div>
          <div className='link-info'>
            <VotingLink />
            <VotingDescriptionInfo
              proposal={proposal}
              status={status}
            />
          </div>
        </StyledDiv>
      )}
    </>
  );
}

const StyledDiv = styled.div`
  .voting-summary-text {
    font-size: var(--font-size-small);
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
`;

export default React.memo(VotingSummary);
