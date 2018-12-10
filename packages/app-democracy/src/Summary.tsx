// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';
import { numberFormat } from '@polkadot/ui-react-rx/util/index';

import translate from './translate';

type Props = I18nProps & {
  bestNumber?: BN,
  democracyLaunchPeriod?: BN,
  democracyNextTally?: BN,
  publicProposalCount?: BN,
  referendumCount?: BN,
  democracyVotingPeriod?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { bestNumber = new BN(0), democracyLaunchPeriod = new BN(1), democracyNextTally = new BN(0), publicProposalCount, referendumCount = new BN(0), democracyVotingPeriod = new BN(1), t } = this.props;

    return (
      <summary>
        <section>
          <CardSummary
            label={t('summary.proposalCount', {
              defaultValue: 'proposals'
            })}
          >
            {numberFormat(publicProposalCount)}
          </CardSummary>
          <CardSummary
            label={t('summary.referendumCount', {
              defaultValue: 'referendums'
            })}
          >
            {numberFormat(referendumCount)}
          </CardSummary>
          <CardSummary
            label={t('summary.active', {
              defaultValue: 'active num'
            })}
          >
            {numberFormat(referendumCount.sub(democracyNextTally))}
          </CardSummary>
        </section>
        <section>
          <CardSummary
            label={t('summary.votingPeriod', {
              defaultValue: 'voting period'
            })}
            progress={{
              value: bestNumber.mod(democracyVotingPeriod).addn(1),
              total: democracyVotingPeriod
            }}
          />
          <CardSummary
            label={t('summary.launchPeriod', {
              defaultValue: 'launch period'
            })}
            progress={{
              value: bestNumber.mod(democracyLaunchPeriod).addn(1),
              total: democracyLaunchPeriod
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
  withObservable('democracyLaunchPeriod'),
  withObservable('bestNumber'),
  withObservable('referendumCount'),
  withObservable('democracyNextTally'),
  withObservable('publicProposalCount'),
  withObservable('democracyVotingPeriod')
);
