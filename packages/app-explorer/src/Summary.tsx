// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import storage from '@polkadot/storage';
import classes from '@polkadot/ui-app/util/classes';
import Card from '@polkadot/ui-app/Card';
import Labelled from '@polkadot/ui-app/Labelled';
import Progress from '@polkadot/ui-app/Progress';
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
    // FIXME Shared components for the Cards
    const { className, eraBlockLength, eraBlockProgress, sessionBlockProgress, sessionBrokenValue, sessionBrokenPercentMax, sessionLength, style, t } = this.props;
    const sessionBrokenPercent = sessionBrokenValue && sessionBrokenPercentMax
      ? 100 * sessionBrokenValue.toNumber() / sessionBrokenPercentMax.toNumber()
      : 0;

    return (
      <div
        className={classes('explorer--Summary', className)}
        style={style}
      >
        <div className='explorer--Summary-column'>
          <Card>
            <Labelled label={t('summary.period', {
              defaultValue: 'target time'
            })}>
              <TimePeriod className='explorer--Summary-large' />
            </Labelled>
          </Card>
          <Card>
            <Labelled label={t('summary.now', {
              defaultValue: 'last block'
            })}>
              <TimeNow className='explorer--Summary-large' />
            </Labelled>
          </Card>
        </div>
        <div className='explorer--Summary-column'>
          <Card>
            <Labelled label={t('summary.sessionProgress', {
              defaultValue: 'session'
            })}>
              <div className='explorer--Summary-large'>
                {
                  sessionLength && sessionBlockProgress
                    ? `${sessionBlockProgress.toString()}/${sessionLength.toString()}`
                    : '-'
                }
                {
                  sessionLength && sessionBlockProgress
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        percent={100.0 * sessionBlockProgress.toNumber() / sessionLength.toNumber()}
                      />
                    )
                    : undefined
                }
              </div>
            </Labelled>
          </Card>
          <Card>
            <Labelled label={t('summary.eraProgress', {
              defaultValue: 'era'
            })}>
              <div className='explorer--Summary-large'>
                {
                  eraBlockLength && eraBlockProgress
                    ? `${eraBlockProgress.toString()}/${eraBlockLength.toString()}`
                    : '-'
                }
                {
                  eraBlockLength && eraBlockProgress
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        percent={100.0 * eraBlockProgress.toNumber() / eraBlockLength.toNumber()}
                      />
                    )
                    : undefined
                }
              </div>
            </Labelled>
          </Card>
          <Card>
            <Labelled label={t('summary.brokenCount', {
              defaultValue: 'broken'
            })}>
              <div className='explorer--Summary-large'>
                {
                  sessionBrokenPercent && sessionBrokenPercentMax
                    ? `${sessionBrokenPercent.toString()}/${sessionBrokenPercentMax.toString()}%`
                    : '-'
                }
                {
                  sessionBrokenPercent && sessionBrokenPercent
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        color={(() => {
                          if (sessionBrokenPercent > 70) {
                            return 'red';
                          } else if (sessionBrokenPercent > 25) {
                            return 'orange';
                          } else {
                            return 'green';
                          }
                        })()}
                        percent={sessionBrokenPercent}
                      />
                    )
                    : undefined
                }
              </div>
            </Labelled>
          </Card>
        </div>
        <div className='explorer--Summary-column'>
          <Card>
            <Labelled label={t('summary.best', {
              defaultValue: 'best'
            })}>
              <BestNumber className='explorer--Summary-large' />
            </Labelled>
          </Card>
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
