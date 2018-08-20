// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import CardSummary from '@polkadot/ui-app/CardSummary';
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

class SummarySession extends React.PureComponent<Props> {
  render () {
    const { eraBlockLength, eraBlockProgress, sessionBlockProgress, sessionBrokenValue, sessionBrokenPercentLate, sessionLength, t } = this.props;

    return [
      <CardSummary
        key='sessionProgress'
        label={t('summary.sessionProgress', {
          defaultValue: 'session'
        })}
        progress={{
          total: sessionLength,
          value: sessionBlockProgress
        }}
      />,
      <CardSummary
        key='eraProgress'
        label={t('summary.eraProgress', {
          defaultValue: 'era'
        })}
        progress={{
          total: eraBlockLength,
          value: eraBlockProgress
        }}
      />,
      <CardSummary
        key='brokenCount'
        label={t('summary.brokenCount', {
          defaultValue: 'lateness'
        })}
        progress={{
          color: 'autoReverse',
          isPercent: true,
          total: sessionBrokenPercentLate,
          value: sessionBrokenValue
        }}
      />
    ];
  }
}

export default withMulti(
  SummarySession,
  translate,
  withObservable('eraBlockLength'),
  withObservable('eraBlockProgress'),
  withObservable('sessionBlockProgress'),
  withObservable('sessionBrokenValue'),
  withObservable('sessionLength'),
  withObservable('sessionBrokenPercentLate')
);
