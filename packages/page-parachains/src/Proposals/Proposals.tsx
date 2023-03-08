// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Proposals as UseProposals } from '../types.js';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Proposal from './Proposal.js';

interface Props {
  proposals?: UseProposals;
}

function Proposals ({ proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const sortedIds = useMemo(
    () => proposals && proposals.proposalIds.sort((a, b) => a.cmp(b)),
    [proposals]
  );

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t<string>('proposals'), 'start', 3],
    [],
    [],
    [t<string>('proposer'), 'address'],
    [t<string>('balance'), 'media--1100'],
    [t<string>('initial state'), 'start media--1400'],
    []
  ]);

  return (
    <Table
      empty={proposals && sortedIds && t<string>('There are no pending proposals')}
      header={headerRef.current}
    >
      {proposals && sortedIds?.map((id): React.ReactNode => (
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
