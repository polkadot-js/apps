// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';
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

function ProposalCell ({ className, imageHash, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!proposal) {
    return (
      <td className={`${className} all`}>
        <label>{t('preimage hash')}</label>
        {imageHash.toString()}
      </td>
    );
  }

  const { method, section } = registry.findMetaCall(proposal.callIndex);
  const isTreasury = section === 'treasury' && METHOD_TREA.includes(method);
  const isExternal = section === 'democracy' && METHOD_EXTE.includes(method);

  return (
    <td className={`${className} all`}>
      <CallExpander
        labelHash={t('proposal hash')}
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
