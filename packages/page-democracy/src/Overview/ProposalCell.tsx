// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Compact } from '@polkadot/types';
import type { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import React from 'react';
import styled from 'styled-components';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { CallExpander } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import ExternalCell from './ExternalCell';
import TreasuryCell from './TreasuryCell';

interface Props {
  className?: string;
  imageHash: Hash | HexString;
  proposal?: Proposal | null;
}

const METHOD_EXTE = ['externalPropose', 'externalProposeDefault', 'externalProposeMajority', 'fastTrack'];
const METHOD_TREA = ['approveProposal', 'rejectProposal'];

function ProposalCell ({ className = '', imageHash, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const preimage = usePreimage(imageHash);

  const details = proposal
    ? [proposal, proposal.registry.findMetaCall(proposal.callIndex)]
    : preimage?.proposal
      ? [preimage.proposal, preimage.registry.findMetaCall(preimage.proposal.callIndex)]
      : null;

  if (!details) {
    const textHash = imageHash.toString();

    return (
      <td className={`${className} all`}>
        <div className='shortHash'>{textHash.slice(0, 8)}…{textHash.slice(-8)}</div>
      </td>
    );
  }

  const { method, section } = details[1];
  const isTreasury = section === 'treasury' && METHOD_TREA.includes(method);
  const isExternal = section === 'democracy' && METHOD_EXTE.includes(method);

  return (
    <td className={`${className} all`}>
      <CallExpander
        labelHash={t<string>('proposal hash')}
        value={proposal}
        withHash={!isTreasury && !isExternal}
      >
        {isExternal && (
          <ExternalCell value={details[0].args[0] as Hash} />
        )}
        {isTreasury && (
          <TreasuryCell value={details[0].args[0] as Compact<ProposalIndex>} />
        )}
      </CallExpander>
    </td>
  );
}

export default React.memo(styled(ProposalCell)`
  .shortHash {
    font: var(--font-mono);

    + div {
      margin-left: 0.5rem;
    }
  }
`);
