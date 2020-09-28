// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React from 'react';
import { CallExpander } from '@polkadot/react-components';
import { Compact } from '@polkadot/types';

import { useTranslation } from '../translate';
import ExternalCell from './ExternalCell';
import TreasuryCell from './TreasuryCell';

interface Props {
  className?: string;
  imageHash: Hash | string;
  proposal?: Proposal | null;
}

const METHOD_EXTE = ['externalPropose', 'externalProposeDefault', 'externalProposeMajority'];
const METHOD_TREA = ['approveProposal', 'rejectProposal'];

function ProposalCell ({ className = '', imageHash, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!proposal) {
    const textHash = imageHash.toString();

    return (
      <td className={`${className} all`}>
        {t('preimage {{hash}}', { replace: { hash: `${textHash.slice(0, 8)}…${textHash.slice(-8)}` } })}
      </td>
    );
  }

  const { method, section } = proposal.registry.findMetaCall(proposal.callIndex);
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
          <ExternalCell value={proposal.args[0] as Hash} />
        )}
        {isTreasury && (
          <TreasuryCell value={proposal.args[0] as Compact<ProposalIndex>} />
        )}
      </CallExpander>
    </td>
  );
}

export default React.memo(ProposalCell);
