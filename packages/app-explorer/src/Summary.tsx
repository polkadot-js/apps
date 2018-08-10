// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import storage from '@polkadot/storage';
import classes from '@polkadot/ui-app/util/classes';
import CardSummary from '@polkadot/ui-app/CardSummary';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';
import TimePeriod from '@polkadot/ui-react-rx/TimePeriod';
import TimeNow from '@polkadot/ui-react-rx/TimeNow';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';

import translate from './translate';
import withApiObservable from '@polkadot/ui-react-rx/with/apiObservable';

type Props = I18nProps & {
  eraBlockLength?: BN,
  eraBlockProgress?: BN,
  sessionBlockProgress?: BN,
  sessionBrokenValue?: BN,
  sessionBrokenPercentMax?: BN,
  sessionLength?: BN
};

type State = {
  bestNumber?: BN
};

class Summary extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { className, eraBlockLength, eraBlockProgress, sessionBlockProgress, sessionBrokenValue, sessionBrokenPercentMax, sessionLength, style, t } = this.props;
    const sessionBrokenPercent = new BN(Math.round(
      sessionBrokenValue && sessionBrokenPercentMax
        ? 100 * sessionBrokenValue.toNumber() / sessionBrokenPercentMax.toNumber()
        : 0
    ));

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
            isProgress
            label={t('summary.sessionProgress', {
              defaultValue: 'session'
            })}
            progressValue={sessionBlockProgress}
            progressTotal={sessionLength}
          />
          <CardSummary
            isProgress
            label={t('summary.eraProgress', {
              defaultValue: 'era'
            })}
            progressValue={eraBlockProgress}
            progressTotal={eraBlockLength}
          />
          <CardSummary
            isProgress
            label={t('summary.brokenCount', {
              defaultValue: 'broken'
            })}
            progressColor='autoReverse'
            progressValue={sessionBrokenPercent}
            progressTotal={sessionBrokenPercentMax}
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
  withApiObservable(
    'eraBlockLength',
    { propName: 'eraBlockLength' }
  ),
  withApiObservable(
    'eraBlockProgress',
    { propName: 'eraBlockProgress' }
  ),
  withApiObservable(
    'sessionBlockProgress',
    { propName: 'sessionBlockProgress' }
  ),
  withApiObservable(
    'sessionBrokenValue',
    { propName: 'sessionBrokenValue' }
  ),
  withStorage(
    storage.session.public.length,
    { propName: 'sessionLength' }
  ),
  withStorage(
    storage.session.public.brokenPercentLate,
    { propName: 'sessionBrokenPercentMax' }
  )
);
