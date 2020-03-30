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

function Candidates ({ allVotes = {}, electionsInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <Table>
        <Table.Head>
          <th className='start' colSpan={2}><h1>{t('runners up')}</h1></th>
          <th>{t('backing')}</th>
        </Table.Head>
        <Table.Body empty={electionsInfo && t('No runners up found')}>
          {electionsInfo?.runnersUp.map(([accountId, balance]): React.ReactNode => (
            <Candidate
              address={accountId}
              balance={balance}
              key={accountId.toString()}
              voters={allVotes[accountId.toString()]}
            />
          ))}
        </Table.Body>
      </Table>
      <Table>
        <Table.Head>
          <th className='start' colSpan={2}><h1>{t('candidates')}</h1></th>
          <th>{t('backing')}</th>
        </Table.Head>
        <Table.Body empty={electionsInfo && t('No candidates found')}>
          {electionsInfo?.candidates.map((accountId): React.ReactNode => (
            <Candidate
              address={accountId}
              key={accountId.toString()}
              voters={allVotes[accountId.toString()]}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

export default React.memo(Candidates);
