// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

import translate from './translate';

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

    if (!withEra) {
      return null;
    }

    return (
      <CardSummary
        label={t('era')}
        progress={{
          total: session_info && session_info.eraLength,
          value: session_info && session_info.eraProgress
        }}
      />
    );
  }

  private renderSession () {
    const { session_info, t, withSession = true } = this.props;

    if (!withSession) {
      return null;
    }

    return (
      <CardSummary
        label={t('session')}
        progress={{
          total: session_info && session_info.sessionLength,
          value: session_info && session_info.sessionProgress
        }}
      />
    );
  }
}

export default translate(
  withCalls<Props>(
    'derive.session.info'
  )(SummarySession)
);
