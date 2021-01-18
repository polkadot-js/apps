// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useMembers } from '@polkadot/react-hooks';

import Description from '../Description';
import { getProposalToDisplay } from '../helpers/extendedStatuses';

interface Props {
  className?: string;
  proposals: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function VotingSummary ({ className, proposals, status }: Props): JSX.Element {
  const { members } = useMembers();

  const proposal = useMemo(() => getProposalToDisplay(proposals, status), [proposals, status]);
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
          <p className='voting-summary-text'><span>Aye</span> <b>{ayes}/{threshold}</b></p>
          <p className='voting-summary-text'><span>Nay</span> <b>{nays}/{nayThreshold}</b></p>
          <Description description='Voting results' />
        </div>
      )}
    </>
  );
}

export default React.memo(styled(VotingSummary)`
  .voting-summary-text {
    font-size: 0.85rem;
    line-height: 0.5rem;
    color: #1A1B20;

    span {
      min-width: 0.5rem;
      margin-right: 0.5rem;
    }
  }
`);
