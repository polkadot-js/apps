// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';
import { I18nProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import { useApi, trackStream } from '@polkadot/react-hooks';

import ProposalDisplay from './Proposal';
import translate from '../translate';

function Proposals ({ className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const proposals = trackStream<DeriveProposal[]>(api.derive.democracy.proposals, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('proposals')}</h1>
      {
        proposals?.length
          ? proposals.map((proposal): React.ReactNode => (
            <ProposalDisplay
              key={proposal.index.toString()}
              value={proposal}
            />
          ))
          : t('No active proposals')
      }
    </div>
  );
}

export default translate(Proposals);
