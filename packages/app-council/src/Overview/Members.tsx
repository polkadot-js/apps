// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AccountId, BlockNumber } from '@polkadot/types';
import { Columns } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import translate from '../translate';
import Candidate from './Candidate';
import Member from './Member';

type Props = I18nProps & {
  council_activeCouncil?: Array<[string, BlockNumber]>
  council_candidates?: Array<string>
};

class Members extends React.PureComponent<Props> {
  render () {
    const { council_activeCouncil = [], council_candidates = [], t } = this.props;

    return (
      <Columns>
        <div>
          <h1>{t('council')}</h1>
          {this.renderNone(council_activeCouncil.map(([address, block]) => (
            <Member
              address={address}
              block={block}
              key={address}
            />
          )))}
        </div>
        <div>
          <h1>{t('candidates')}</h1>
          {this.renderNone(council_candidates.map((address) => (
            <Candidate
              address={address}
              key={address}
            />
          )))}
        </div>
      </Columns>
    );
  }

  private renderNone (items: Array<React.ReactNode>) {
    const { t } = this.props;

    return items.length
      ? items
      : <div>{t('No addresses found')}</div>;
  }
}

export default translate(
  withCalls<Props>(
    ['query.council.activeCouncil', {
      transform: (active: Array<[AccountId, BlockNumber]>) =>
        active.map(([accountId, blockNumber]) => [accountId.toString(), blockNumber])
    }],
    ['query.council.candidates', {
      transform: (candidates: Array<AccountId>) =>
        candidates.map((accountId) => accountId.toString())
    }]
  )(Members)
);
