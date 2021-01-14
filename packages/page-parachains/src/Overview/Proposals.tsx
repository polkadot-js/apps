// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Proposals as UseProposals } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Proposal from './Proposal';

interface Props {
  proposals?: UseProposals;
}

function Proposals ({ proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('proposals'), 'start', 2],
    [],
    [t('proposer'), 'address'],
    [t('balance'), 'media--1100'],
    [t('initial state'), 'start media--1700'],
    [t('validation'), 'start media--1500'],
    [t('validators'), 'start'],
    []
  ]);

  return (
    <Table
      empty={proposals && t<string>('There are no pending proposals')}
      header={headerRef.current}
    >
      {proposals?.proposalIds.map((id): React.ReactNode => (
        <Proposal
          approvedIds={proposals.approvedIds}
          id={id}
          key={id.toString()}
          scheduled={proposals.scheduled}
        />
      ))}
    </Table>
  );
}

export default React.memo(Proposals);
