// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { Spinner, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props extends ComponentProps {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
  prime?: AccountId | null;
}

function Members ({ allVotes = {}, className, electionsInfo, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h1>{t('members')}</h1>
      {electionsInfo
        ? electionsInfo.members.length
          ? (
            <Table>
              <Table.Head>
                <th colSpan={2}>&nbsp;</th>
                <th>{t('backing')}</th>
              </Table.Head>
              <Table.Body>
                {electionsInfo.members.map(([accountId, balance]): React.ReactNode => (
                  <Candidate
                    address={accountId}
                    balance={balance}
                    isPrime={prime?.eq(accountId)}
                    key={accountId.toString()}
                    voters={allVotes[accountId.toString()]}
                  />
                ))}
              </Table.Body>
            </Table>
          )
          : <div>{t('No members found')}</div>
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(Members);
