// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useMembers } from '@polkadot/react-hooks';

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
        <div className={className}>
          <div>Aye <span className='votes'>{ayes}</span>/{threshold}</div>
          <div>Nay <span className='votes'>{nays}</span>/{nayThreshold}</div>
          <div className='description'>Voting results</div>
        </div>
      )}
    </>
  );
}

export default React.memo(styled(VotingSummary)(() => `
  font-size: 12px;

  & .description {
    font-size: 10px;
    color: #8B8B8B;
    margin-top: 10px;
    text-transform: none;
  }

  & .votes {
    font-weight: 700;
  }
`));
