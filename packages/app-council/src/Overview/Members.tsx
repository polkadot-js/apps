/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { Columar, Column } from '@polkadot/react-components';

import translate from '../translate';
import Candidate from './Candidate';
import Member from './Member';

interface Props extends I18nProps, ComponentProps {
  allVotes?: Record<string, AccountId[]>;
}

function Members ({ allVotes = {}, electionsInfo: { candidates, members }, t }: Props): React.ReactElement<Props> {
  return (
    <Columar>
      <Column
        emptyText={t('No members found')}
        headerText={t('members')}
      >
        {members.map(([accountId]): React.ReactNode => (
          <Member
            address={accountId}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Column>
      <Column
        emptyText={t('No candidates found')}
        headerText={t('candidates')}
      >
        {candidates.map((accountId): React.ReactNode => (
          <Candidate
            address={accountId}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Column>
    </Columar>
  );
}

export default translate(
  withCalls<Props>(
    ['query.electionsPhragmen.votesOf', {
      propName: 'allVotes',
      transform: ([voters, casted]: [AccountId[], AccountId[][]]): Record<string, AccountId[]> =>
        voters.reduce((result: Record<string, AccountId[]>, voter, index): Record<string, AccountId[]> => {
          casted[index].forEach((candidate): void => {
            const address = candidate.toString();

            if (!result[address]) {
              result[address] = [];
            }

            result[address].push(voter);
          });

          return result;
        }, {})
    }]
  )(Members)
);
