// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import CardSummary from '@polkadot/ui-app/CardSummary';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';
import TimePeriod from '@polkadot/ui-react-rx/TimePeriod';
import TimeNow from '@polkadot/ui-react-rx/TimeNow';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import translate from './translate';

type Props = I18nProps & {
  eraBlockLength?: BN,
  eraBlockProgress?: BN,
  sessionBlockProgress?: BN,
  sessionBrokenValue?: BN,
  sessionBrokenPercentLate?: BN,
  sessionLength?: BN
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, eraBlockLength, eraBlockProgress, sessionBlockProgress, sessionBrokenValue, sessionBrokenPercentLate, sessionLength, style, t } = this.props;

    return (
      <div
        className={classes('explorer--Summary', className)}
        style={style}
      >
        <div className='explorer--Summary-column'>
          <CardSummary label={t('summary.period', {
            defaultValue: 'target time'
          })}>
            <TimePeriod />
          </CardSummary>
          <CardSummary label={t('summary.now', {
            defaultValue: 'last block'
          })}>
            <TimeNow />
          </CardSummary>
        </div>
        <div className='explorer--Summary-column'>
          <CardSummary
            label={t('summary.sessionProgress', {
              defaultValue: 'session'
            })}
            progress={{
              total: sessionLength,
              value: sessionBlockProgress
            }}
          />
          <CardSummary
            label={t('summary.eraProgress', {
              defaultValue: 'era'
            })}
            progress={{
              total: eraBlockLength,
              value: eraBlockProgress
            }}
          />
          <CardSummary
            label={t('summary.brokenCount', {
              defaultValue: 'lateness'
            })}
            progress={{
              color: 'autoReverse',
              total: sessionBrokenPercentLate,
              value: sessionBrokenValue
            }}
          />
        </div>
        <div className='explorer--Summary-column'>
          <CardSummary label={t('summary.best', {
            defaultValue: 'best'
          })}>
            <BestNumber />
          </CardSummary>
        </div>
      </div>
    );
  }
}

export default withMulti(
  Summary,
  translate,
  withObservable('eraBlockLength'),
  withObservable('eraBlockProgress'),
  withObservable('sessionBlockProgress'),
  withObservable('sessionBrokenValue'),
  withObservable('sessionLength'),
  withObservable('sessionBrokenPercentLate')
);
