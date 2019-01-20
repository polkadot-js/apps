// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { numberFormat } from '@polkadot/ui-reactive/util/index';

import translate from './translate';

type Props = I18nProps & {
  chain_bestNumber?: BN,
  democracy_launchPeriod?: BN,
  democracy_nextTally?: BN,
  democracy_publicDelay?: BN,
  democracy_publicPropCount?: BN,
  democracy_referendumCount?: BN,
  democracy_votingPeriod?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { chain_bestNumber = new BN(0), democracy_launchPeriod = new BN(1), democracy_nextTally = new BN(0), democracy_publicPropCount, democracy_referendumCount = new BN(0), democracy_votingPeriod = new BN(1), t } = this.props;

    return (
      <summary>
        <section>
          <CardSummary label={t('proposals')}>
            {numberFormat(democracy_publicPropCount)}
          </CardSummary>
          <CardSummary label={t('referendums')}>
            {numberFormat(democracy_referendumCount)}
          </CardSummary>
          <CardSummary label={t('active')}>
            {numberFormat(democracy_referendumCount.sub(democracy_nextTally))}
          </CardSummary>
        </section>
        <section>
          <CardSummary
            label={t('voting period')}
            progress={{
              value: chain_bestNumber.mod(democracy_votingPeriod).addn(1),
              total: democracy_votingPeriod
            }}
          />
          <CardSummary
            label={t('launch period')}
            progress={{
              value: chain_bestNumber.mod(democracy_launchPeriod).addn(1),
              total: democracy_launchPeriod || new BN(1)
            }}
          />
        </section>
      </summary>
    );
  }
}

export default withMulti(
  Summary,
  translate,
  withCall('query.democracy.launchPeriod'),
  withCall('query.democracy.nextTally'),
  withCall('query.democracy.publicPropCount'),
  withCall('query.democracy.referendumCount'),
  withCall('query.democracy.votingPeriod'),
  withCall('derive.chain.bestNumber')
);
