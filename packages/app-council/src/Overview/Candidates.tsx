/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props extends ComponentProps {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
}

export default function Candidates ({ allVotes = {}, className, electionsInfo: { candidates, runnersUp } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h1>{t('runners up')}</h1>
      {runnersUp.length
        ? (
          <Table>
            <Table.Body>
              {runnersUp.map(([accountId, balance]): React.ReactNode => (
                <Candidate
                  address={accountId}
                  balance={balance}
                  key={accountId.toString()}
                  voters={allVotes[accountId.toString()]}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No runners up found')
      }
      <h1>{t('candidates')}</h1>
      {candidates.length
        ? (
          <Table>
            <Table.Body>
              {candidates.map((accountId): React.ReactNode => (
                <Candidate
                  address={accountId}
                  key={accountId.toString()}
                  voters={allVotes[accountId.toString()]}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No candidates found')
      }
    </div>
  );
}
