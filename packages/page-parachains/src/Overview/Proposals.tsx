// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParachainProposal, ParaId } from '@polkadot/types/interfaces';
import type { ProposalExt } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Proposal from './Proposal';

interface Props {
  className?: string;
}

const transformProposals = {
  transform: (entries: [{ args: [ParaId] }, Option<ParachainProposal>][]): ProposalExt[] => {
    return entries
      .filter(([, opt]) => opt.isSome)
      .map(([{ args: [id] }, optProposal]) => ({ id, proposal: optProposal.unwrap() }));
  }
};

function Proposals (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposals = useCall<ProposalExt[]>(api.query.proposeParachain.proposals.entries, undefined, transformProposals);

  const headerRef = useRef([
    [t('proposals'), 'start', 2],
    [t('proposer'), 'address'],
    [t('balance')],
    [t('initial state'), 'start'],
    [t('validation'), 'start'],
    [t('validators'), 'address']
  ]);

  return (
    <Table
      empty={proposals && t<string>('There are no pending proposals')}
      header={headerRef.current}
    >
      {proposals?.map((proposal): React.ReactNode => (
        <Proposal
          key={proposal.id.toString()}
          proposal={proposal}
        />
      ))}
    </Table>
  );
}

export default React.memo(Proposals);
