// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import { OwnMembers } from '../types';

import React from 'react';
import { Spinner, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props extends OwnMembers {
  className?: string;
}

function Candidates ({ allMembers, className, isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidates = useCall<DeriveSocietyCandidate[]>(api.derive.society.candidates, []);

  return (
    <div className={`overviewSection ${className}`}>
      <h1>{t('candidates')}</h1>
      {candidates
        ? candidates.length
          ? (
            <Table>
              <Table.Head>
                <th>&nbsp;</th>
                <th>{t('kind')}</th>
                <th>{t('value')}</th>
                <th colSpan={3}>{t('votes')}</th>
                <th>&nbsp;</th>
              </Table.Head>
              <Table.Body>
                {candidates.map((candidate): React.ReactNode => (
                  <Candidate
                    allMembers={allMembers}
                    isMember={isMember}
                    key={candidate.accountId.toString()}
                    ownMembers={ownMembers}
                    value={candidate}
                  />
                ))}
              </Table.Body>
            </Table>
          )
          : <div>{t('No candidates')}</div>
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(Candidates);
