// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props {
  allMembers: string[];
  className?: string;
  isMember: boolean;
  ownMembers: string[];
}

function Candidates ({ allMembers, className = '', isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidates = useCall<DeriveSocietyCandidate[]>(api.derive.society.candidates);

  const headerRef = useRef([
    [t('candidates'), 'start'],
    [t('kind')],
    [t('value')],
    [t('votes'), 'start']
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
