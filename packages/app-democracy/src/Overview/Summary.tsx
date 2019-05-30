// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  chain_bestNumber?: BN,
  democracy_launchPeriod?: BN,
  democracy_nextTally?: BN,
  democracy_publicDelay?: BN,
  democracy_publicPropCount?: BN,
  democracy_referendumCount?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { chain_bestNumber = new BN(0), democracy_launchPeriod = new BN(1), democracy_nextTally = new BN(0), democracy_publicPropCount, democracy_referendumCount = new BN(0), t } = this.props;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('proposals')}>
            {formatNumber(democracy_publicPropCount)}
          </CardSummary>
          <CardSummary label={t('referenda')}>
            {formatNumber(democracy_referendumCount)}
          </CardSummary>
          <CardSummary label={t('active')}>
            {formatNumber(democracy_referendumCount.sub(democracy_nextTally))}
          </CardSummary>
        </section>
        <section className='ui--media-medium'>
          <CardSummary
            label={t('launch period')}
            progress={{
              value: chain_bestNumber.mod(democracy_launchPeriod).addn(1),
              total: democracy_launchPeriod || new BN(1)
            }}
          />
        </section>
      </SummaryBox>
    );
  }
}

export default translate(
  withCalls<Props>(
    'query.democracy.launchPeriod',
    'query.democracy.nextTally',
    'query.democracy.publicPropCount',
    'query.democracy.referendumCount',
    'derive.chain.bestNumber'
  )(Summary)
);
