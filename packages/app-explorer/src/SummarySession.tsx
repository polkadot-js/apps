// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { CardSummary } from '@polkadot/ui-app/index';
import { withCalls } from '@polkadot/ui-api/index';

import translate from './translate';

type Props = I18nProps & {
  session_eraLength?: BN,
  session_eraProgress?: BN,
  session_sessionProgress?: BN,
  // FIXME Replaced in poc-3, we should calculate the session reward
  // sessionBrokenValue?: BN,
  // sessionBrokenPercentLate?: BN,
  session_sessionLength?: BlockNumber,
  withBroken?: boolean,
  withEra?: boolean,
  withSession?: boolean
};

class SummarySession extends React.PureComponent<Props> {
  render () {
    return (
      <>
        {this.renderSession()}
        {this.renderEra()}
      </>
    );
  }

  // private renderBroken () {
  //   const { sessionBrokenValue, sessionBrokenPercentLate, t, withBroken = true } = this.props;

  //   if (!withBroken) {
  //     return null;
  //   }

  //   return (
  //     <CardSummary
  //       label={t('lateness')}
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
    const { session_eraLength, session_eraProgress, t, withEra = true } = this.props;

    if (!withEra) {
      return null;
    }

    return (
      <CardSummary
        label={t('era')}
        progress={{
          total: session_eraLength,
          value: session_eraProgress
        }}
      />
    );
  }

  private renderSession () {
    const { session_sessionProgress, session_sessionLength = new BN(0), t, withSession = true } = this.props;

    if (!withSession) {
      return null;
    }

    return (
      <CardSummary
        label={t('session')}
        progress={{
          total: session_sessionLength,
          value: session_sessionProgress
        }}
      />
    );
  }
}

export default translate(
  withCalls<Props>(
    'derive.session.eraLength',
    'derive.session.eraProgress',
    'derive.session.sessionProgress',
    'query.session.sessionLength'
  )(SummarySession)
);
