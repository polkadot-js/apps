/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AccountId, BlockNumber } from '@polkadot/types';
import { Columar, Column } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import translate from '../translate';
import Candidate from './Candidate';
import Member from './Member';

interface Props extends I18nProps {
  elections_members?: [string, BlockNumber][];
  elections_candidates?: string[];
}

class Members extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { elections_members = [], elections_candidates = [], t } = this.props;

    return (
      <Columar>
        <Column
          emptyText={t('No members found')}
          headerText={t('members')}
        >
          {elections_members.map(([address, block]): React.ReactNode => (
            <Member
              address={address}
              block={block}
              key={address}
            />
          ))}
        </Column>
        <Column
          emptyText={t('No members found')}
          headerText={t('candidates')}
        >
          {elections_candidates.map((address): React.ReactNode => (
            <Candidate
              address={address}
              key={address}
            />
          ))}
        </Column>
      </Columar>
    );
  }
}

export default translate(
  withCalls<Props>(
    ['query.elections.members', {
      transform: (active: [AccountId, BlockNumber][]): [string, BlockNumber][] =>
        active.map(([accountId, blockNumber]): [string, BlockNumber] =>
          [accountId.toString(), blockNumber]
        )
    }],
    ['query.elections.candidates', {
      transform: (candidates: AccountId[]): string[] =>
        candidates.map((accountId): string => accountId.toString())
    }]
  )(Members)
);
