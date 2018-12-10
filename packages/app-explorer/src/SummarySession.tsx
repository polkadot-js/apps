// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { CardSummary } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import translate from './translate';

type Props = I18nProps & {
  eraBlockLength?: BlockNumber,
  eraBlockProgress?: BlockNumber,
  sessionBlockProgress?: BlockNumber,
  // FIXME Replaced in poc-3
  // sessionBrokenValue?: BN,
  // sessionBrokenPercentLate?: BN,
  sessionLength?: BlockNumber,
  withBroken?: boolean,
  withEra?: boolean,
  withSession?: boolean
};

class SummarySession extends React.PureComponent<Props> {
  render () {
    return [
      this.renderSession(),
      this.renderEra()
      // FIXME Replace with "reward"
      // this.renderBroken()
    ];
  }

  // private renderBroken () {
  //   const { sessionBrokenValue, sessionBrokenPercentLate, t, withBroken = true } = this.props;

  //   if (!withBroken) {
  //     return null;
  //   }

  //   return (
  //     <CardSummary
  //       key='brokenCount'
  //       label={t('summary.brokenCount', {
  //         defaultValue: 'lateness'
  //       })}
  //       progress={{
  //         color: 'autoReverse',
  //         isPercent: true,
  //         total: sessionBrokenPercentLate,
  //         value: sessionBrokenValue
  //       }}
  //     />
  //   );
  // }

  private renderEra () {
    const { eraBlockLength, eraBlockProgress, t, withEra = true } = this.props;

    if (!withEra) {
      return null;
    }

    return (
      <CardSummary
        key='eraProgress'
        label={t('summary.eraProgress', {
          defaultValue: 'era'
        })}
        progress={{
          total: eraBlockLength,
          value: eraBlockProgress
        }}
      />
    );
  }

  private renderSession () {
    const { sessionBlockProgress, sessionLength, t, withSession = true } = this.props;

    if (!withSession) {
      return null;
    }

    return (
      <CardSummary
        key='sessionProgress'
        label={t('summary.sessionProgress', {
          defaultValue: 'session'
        })}
        progress={{
          total: sessionLength,
          value: sessionBlockProgress
        }}
      />
    );
  }
}

export default withMulti(
  SummarySession,
  translate,
  withObservable('eraBlockLength'),
  withObservable('eraBlockProgress'),
  withObservable('sessionBlockProgress'),
  withObservable('sessionLength')
);
