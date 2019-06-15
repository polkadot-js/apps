// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import translate from './translate';
import { formatNumber } from '@polkadot/util';

type Props = I18nProps & {
  session_info?: DerivedSessionInfo,
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

  private renderEra () {
    const { session_info, t, withEra = true } = this.props;

    if (!withEra || ! session_info) {
      return null;
    }

    return session_info.sessionLength.gtn(0)
        ? (
        <CardSummary
          label={t('era')}
          progress={{
            total: session_info && session_info.eraLength,
            value: session_info && session_info.eraProgress
          }}
        />
      )
      : (
        <CardSummary label={t('era')}>
          {formatNumber(session_info.currentEra)}
        </CardSummary>
      );
  }

  private renderSession () {
    const { session_info, t, withSession = true } = this.props;

    if (!withSession || !session_info) {
      return null;
    }

    return session_info.sessionLength.gtn(0)
        ? (
        <CardSummary
          label={t('session')}
          progress={{
            total: session_info.sessionLength,
            value: session_info.sessionProgress
          }}
        />
      )
      : (
        <CardSummary label={t('session')}>
          {formatNumber(session_info.currentIndex)}
        </CardSummary>
      );
  }
}

export default translate(
  withCalls<Props>(
    'derive.session.info'
  )(SummarySession)
);
