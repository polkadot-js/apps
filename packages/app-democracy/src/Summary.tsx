// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import CardSummary from '@polkadot/ui-app/CardSummary';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import translate from './translate';

type Props = I18nProps & {
  democracyLaunchPeriod?: BN,
  democracyVotingPeriod?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, democracyLaunchPeriod, democracyVotingPeriod, style, t } = this.props;

    return (
      <div
        className={classes('democracy--Summary', className)}
        style={style}
      >
        <div className='democracy--Summary-column'>
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
        </div>
      </div>
    );
  }
}

export default withMulti(
  Summary,
  translate,
  withObservable('democracyLaunchPeriod'),
  withObservable('democracyVotingPeriod')
);
