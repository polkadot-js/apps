/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React from 'react';
import { Table } from '@polkadot/react-components';
import Candidate from './Candidate';

import { useTranslation } from '../translate';

export default function Members ({ allVotes = {}, className, electionsInfo: { members } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <h1>{t('council members')}</h1>
      {members.length
        ? (
          <Table>
            <Table.Body>
              {members.map(([accountId, balance]): React.ReactNode => (
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
        : t('No members found')
      }
    </div>
  );
}
