// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import CardSummary from '@polkadot/ui-app/CardSummary';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import translate from './translate';

type Props = I18nProps & {
  democracyLaunchPeriod?: BN,
  democracyNextTally?: BN,
  democracyProposalCount?: BN,
  democracyReferendumCount?: BN,
  democracyVotingPeriod?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, democracyLaunchPeriod, democracyNextTally = new BN(0), democracyProposalCount, democracyReferendumCount = new BN(0), democracyVotingPeriod, style, t } = this.props;

    return (
      <summary
        className={className}
        style={style}
      >
        <section>
          <CardSummary label={t('summary.proposalCount', {
            defaultValue: 'proposals'
          })}>
            {numberFormat(democracyProposalCount)}
          </CardSummary>
          <CardSummary label={t('summary.referendumCount', {
            defaultValue: 'referendums'
          })}>
            {numberFormat(democracyReferendumCount)}
          </CardSummary>
          <CardSummary label={t('summary.active', {
            defaultValue: 'active num'
          })}>
            {democracyNextTally && democracyReferendumCount
              ? numberFormat(democracyReferendumCount.sub(democracyNextTally))
              : 0
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('summary.votingPeriod', {
            defaultValue: 'voting period'
          })}>
            {numberFormat(democracyVotingPeriod)}
          </CardSummary>
          <CardSummary label={t('summary.launchPeriod', {
            defaultValue: 'launch period'
          })}>
            {numberFormat(democracyLaunchPeriod)}
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default withMulti(
  Summary,
  translate,
  withObservable('democracyLaunchPeriod'),
  withObservable('democracyReferendumCount'),
  withObservable('democracyNextTally'),
  withObservable('democracyProposalCount'),
  withObservable('democracyVotingPeriod')
);
