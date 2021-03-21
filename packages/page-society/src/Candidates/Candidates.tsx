// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSocietyCandidate } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props {
  allMembers: string[];
  candidates?: DeriveSocietyCandidate[];
  className?: string;
  isMember: boolean;
  ownMembers: string[];
}

function Candidates ({ allMembers, candidates, className = '', isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('candidates'), 'start'],
    [t('bid kind'), 'start', 2],
    [t('value')],
    [undefined, 'expand'],
    []
  ]);

  return (
    <Table
      className={className}
      empty={candidates && t<string>('No candidates')}
      header={headerRef.current}
    >
      {candidates?.map((candidate): React.ReactNode => (
        <Candidate
          allMembers={allMembers}
          isMember={isMember}
          key={candidate.accountId.toString()}
          ownMembers={ownMembers}
          value={candidate}
        />
      ))}
    </Table>
  );
}

export default React.memo(Candidates);
