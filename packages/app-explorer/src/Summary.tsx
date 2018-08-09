// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
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

type Props = I18nProps & {
  brokenPercentLate?: BN,
  lastEraLengthChange?: BN,
  lastSessionLengthChange?: BN,
  sessionLength?: BN,
  sessionCurrentIndex?: BN,
  sessionCurrentStart?: Date,
  sessionsPerEra?: BN
};

type State = {
  bestNumber?: BN,
  timePeriod?: BN,
  timeNow?: Date
};

class Summary extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    // FIXME These calculations should all be done as observables inside ApiObservable
    // (Initially here for testing purposes)
    // FIXME Shared components for the Cards
    const { brokenPercentLate, className, lastEraLengthChange, lastSessionLengthChange, sessionCurrentIndex, sessionCurrentStart, sessionLength, sessionsPerEra, style, t } = this.props;
    const { bestNumber, timePeriod, timeNow } = this.state;
    const eraLength = sessionsPerEra && sessionLength
      ? sessionsPerEra.mul(sessionLength)
      : undefined;
    const sessionProgress = bestNumber && lastSessionLengthChange && sessionLength
      ? bestNumber
          .sub(lastSessionLengthChange)
          .add(sessionLength)
          .mod(sessionLength)
      : undefined;
    const sessionRemaining = sessionProgress && sessionLength
      ? sessionLength.sub(sessionProgress)
      : undefined;
    const eraProgress = sessionsPerEra && sessionCurrentIndex && sessionLength && sessionProgress && lastEraLengthChange
      ? sessionCurrentIndex
          .sub(lastEraLengthChange)
          .mod(sessionsPerEra)
          .mul(sessionLength)
          .add(sessionProgress)
      : undefined;
    const expectedTime = timePeriod && sessionLength
      ? timePeriod.mul(sessionLength).muln(1000)
      : undefined;
    const remainingTime = timePeriod && sessionRemaining
      ? timePeriod.mul(sessionRemaining).muln(1000)
      : undefined;
    const brokenValue = expectedTime && remainingTime && sessionCurrentStart && sessionRemaining && timePeriod && timeNow
      ? new BN(Math.round(
        (timeNow.getTime() + remainingTime.toNumber() - sessionCurrentStart.getTime()) / expectedTime.toNumber() * 100 - 100
      ))
      : undefined;
    const brokenPercent = brokenValue && brokenPercentLate
      ? 100 * brokenValue.toNumber() / brokenPercentLate.toNumber()
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
              <TimePeriod
                className='explorer--Summary-large'
                onChange={this.setTimePeriod}
              />
            </Labelled>
          </Card>
          <Card>
            <Labelled label={t('summary.now', {
              defaultValue: 'last block'
            })}>
              <TimeNow
                className='explorer--Summary-large'
                onChange={this.setTimeNow}
              />
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
                  sessionLength && sessionProgress
                    ? `${sessionProgress.toString()}/${sessionLength.toString()}`
                    : '-'
                }
                {
                  sessionLength && sessionProgress
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        percent={100.0 * sessionProgress.toNumber() / sessionLength.toNumber()}
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
                  eraLength && eraProgress
                    ? `${eraProgress.toString()}/${eraLength.toString()}`
                    : '-'
                }
                {
                  eraLength && eraProgress
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        percent={100.0 * eraProgress.toNumber() / eraLength.toNumber()}
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
                  brokenValue && brokenPercentLate
                    ? `${brokenValue.toString()}/${brokenPercentLate.toString()}%`
                    : '-'
                }
                {
                  brokenValue && brokenPercentLate
                    ? (
                      <Progress
                        className='explorer--Summary-progress'
                        color={(() => {
                          if (brokenPercent > 70) {
                            return 'red';
                          } else if (brokenPercent > 25) {
                            return 'orange';
                          } else {
                            return 'green';
                          }
                        })()}
                        percent={brokenPercent}
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
              <BestNumber
                className='explorer--Summary-large'
                onChange={this.setBestNumber}
              />
            </Labelled>
          </Card>
        </div>
      </div>
    );
  }

  private setBestNumber = (header?: Header) => {
    this.setState({
      bestNumber: header
        ? header.number
        : undefined
    });
  }

  private setTimePeriod = (timePeriod?: BN) => {
    this.setState({ timePeriod });
  }

  private setTimeNow = (timeNow?: Date) => {
    this.setState({ timeNow });
  }
}

export default withMulti(
  Summary,
  translate,
  withStorage(
    storage.session.public.length,
    { propName: 'sessionLength' }
  ),
  withStorage(
    storage.session.public.lastLengthChange,
    { propName: 'lastSessionLengthChange' }
  ),
  withStorage(
    storage.staking.public.sessionsPerEra,
    { propName: 'sessionsPerEra' }
  ),
  withStorage(
    storage.session.public.currentIndex,
    { propName: 'sessionCurrentIndex' }
  ),
  withStorage(
    storage.session.public.currentStart,
    { propName: 'sessionCurrentStart' }
  ),
  withStorage(
    storage.staking.public.lastEraLengthChange,
    { propName: 'lastEraLengthChange' }
  ),
  withStorage(
    storage.session.public.brokenPercentLate,
    { propName: 'brokenPercentLate' }
  )
);
