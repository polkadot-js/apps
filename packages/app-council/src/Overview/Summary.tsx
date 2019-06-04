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
  council_activeCouncil?: Array<[AccountId, BlockNumber]>
  council_candidateCount?: BN,
  council_desiredSeats?: BN,
  council_termDuration?: BN,
  council_voteCount?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { council_activeCouncil = [], council_candidateCount = new BN(0), council_desiredSeats = new BN(1), council_termDuration = new BN(0), council_voteCount = new BN(0), t } = this.props;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('seats')}>
            {formatNumber(council_activeCouncil.length)}/{formatNumber(council_desiredSeats)}
          </CardSummary>
          <CardSummary label={t('candidates')}>
            {formatNumber(council_candidateCount)}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('total votes')}>
            {formatNumber(council_voteCount)}
          </CardSummary>
        </section>

        <section>
          <CardSummary label={t('term duration')}>
              {formatNumber(council_termDuration)}
           </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(
  withCalls<Props>(
    'query.council.activeCouncil',
    'query.council.candidateCount',
    'query.council.desiredSeats',
    'query.council.termDuration',
    'query.council.voteCount'
  )(Summary)
);
