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

type Props = I18nProps & {
  elections_members?: Array<[string, BlockNumber]>
  elections_candidates?: Array<string>
};

class Members extends React.PureComponent<Props> {
  render () {
    const { elections_members = [], elections_candidates = [], t } = this.props;

    return (
      <Columar>
        <Column
          emptyText={t('No members found')}
          headerText={t('members')}
        >
          {elections_members.map(([address, block]) => (
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
          {elections_candidates.map((address) => (
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
      transform: (active: Array<[AccountId, BlockNumber]>) =>
        active.map(([accountId, blockNumber]) => [accountId.toString(), blockNumber])
    }],
    ['query.elections.candidates', {
      transform: (candidates: Array<AccountId>) =>
        candidates.map((accountId) => accountId.toString())
    }]
  )(Members)
);
