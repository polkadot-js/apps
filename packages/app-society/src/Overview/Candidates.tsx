// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props {
  className?: string;
}

export default function Candidates ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidates = useCall<DeriveSocietyCandidate[]>(api.derive.society.candidates, []);

  return (
    <div className={`overviewSection ${className}`}>
      <h1>{t('candidates')}</h1>
      {candidates?.length
        ? (
          <Table>
            <Table.Body>
              {candidates.map((candidate): React.ReactNode => (
                <Candidate
                  key={candidate.accountId.toString()}
                  value={candidate}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No candidates')
      }
    </div>
  );
}
