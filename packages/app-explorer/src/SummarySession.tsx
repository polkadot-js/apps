/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { CardSummary } from '@polkadot/react-components';
import { withCalls } from '@polkadot/react-api';

import translate from './translate';
import { formatNumber } from '@polkadot/util';

interface Props extends I18nProps {
  session_info?: DerivedSessionInfo;
  withEra?: boolean;
  withSession?: boolean;
}

class SummarySession extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    return (
      <>
        {this.renderSession()}
        {this.renderEra()}
      </>
    );
  }

  private renderEra (): React.ReactNode {
    const { session_info, t, withEra = true } = this.props;

    if (!withEra || !session_info) {
      return null;
    }

    const label = t('era');

    return session_info.sessionLength.gtn(0)
      ? (
        <CardSummary
          label={label}
          progress={{
            total: session_info && session_info.eraLength,
            value: session_info && session_info.eraProgress
          }}
        />
      )
      : (
        <CardSummary label={label}>
          {formatNumber(session_info.currentEra)}
        </CardSummary>
      );
  }

  private renderSession (): React.ReactNode {
    const { session_info, t, withSession = true } = this.props;

    if (!withSession || !session_info) {
      return null;
    }

    const label = session_info.isEpoch
      ? t('epoch')
      : t('session');

    return session_info.sessionLength.gtn(0)
      ? (
        <CardSummary
          label={label}
          progress={{
            total: session_info.sessionLength,
            value: session_info.sessionProgress
          }}
        />
      )
      : (
        <CardSummary label={label}>
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
