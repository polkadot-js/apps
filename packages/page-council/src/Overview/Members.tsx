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

export default function Members ({ allVotes = {}, className, electionsInfo: { members } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
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
