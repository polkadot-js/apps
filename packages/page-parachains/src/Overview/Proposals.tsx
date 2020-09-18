// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ProposalExt } from './types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Proposal from './Proposal';

interface Props {
  proposals?: ProposalExt[];
}

function Proposals ({ proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

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
