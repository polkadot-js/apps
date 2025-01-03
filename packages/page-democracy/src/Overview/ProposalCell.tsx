// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Compact } from '@polkadot/types';
import type { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { useApi, usePreimage } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';
import ExternalCell from './ExternalCell.js';
import TreasuryCell from './TreasuryCell.js';

interface Props {
  className?: string;
  imageHash: Hash | HexString;
  isCollective?: boolean;
  proposal?: Proposal | null;
}

const METHOD_EXTE = ['externalPropose', 'externalProposeDefault', 'externalProposeMajority', 'fastTrack'];
const METHOD_TREA = ['approveProposal', 'rejectProposal'];

function ProposalCell ({ className = '', imageHash, isCollective, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const preimage = usePreimage(imageHash);

  // while we still have this endpoint, democracy will use it
  const displayProposal = isCollective
    ? proposal
    : api.query.democracy?.preimages
      ? proposal
      : preimage?.proposal;

  if (!displayProposal) {
    const textHash = imageHash.toString();

    return (
      <td className={`${className} all hash`}>
        <div className='shortHash'>{textHash}</div>
      </td>
    );
  }

  const { method, section } = displayProposal.registry.findMetaCall(displayProposal.callIndex);
  const isTreasury = section === 'treasury' && METHOD_TREA.includes(method);
  const isExternal = section === 'democracy' && METHOD_EXTE.includes(method);

  return (
    <StyledTd className={`${className} all`}>
      <CallExpander
        labelHash={t('proposal hash')}
        value={displayProposal}
        withHash={!isTreasury && !isExternal}
      >
        {isExternal && (
          <ExternalCell value={displayProposal.args[0] as Hash} />
        )}
        {isTreasury && (
          <TreasuryCell value={displayProposal.args[0] as Compact<ProposalIndex>} />
        )}
      </CallExpander>
    </StyledTd>
  );
}

const StyledTd = styled.td`
  .shortHash {
    + div {
      margin-left: 0.5rem;
    }
  }
`;

export default React.memo(ProposalCell);
