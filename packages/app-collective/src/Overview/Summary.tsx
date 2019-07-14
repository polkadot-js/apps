// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, BlockNumber } from '@polkadot/types';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  elections_members?: Array<[AccountId, BlockNumber]>
  elections_candidateCount?: BN,
  elections_desiredSeats?: BN,
  elections_termDuration?: BN,
  elections_voteCount?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { elections_members = [], elections_candidateCount = new BN(0), elections_desiredSeats = new BN(1), elections_termDuration = new BN(0), elections_voteCount = new BN(0), t } = this.props;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('seats')}>
            {formatNumber(elections_members.length)}/{formatNumber(elections_desiredSeats)}
          </CardSummary>
          <CardSummary label={t('candidates')}>
            {formatNumber(elections_candidateCount)}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('total votes')}>
            {formatNumber(elections_voteCount)}
          </CardSummary>
        </section>

        <section>
          <CardSummary label={t('term duration')}>
              {formatNumber(elections_termDuration)}
           </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(
  withCalls<Props>(
    'query.elections.members',
    'query.elections.candidateCount',
    'query.elections.desiredSeats',
    'query.elections.termDuration',
    'query.elections.voteCount'
  )(Summary)
);
