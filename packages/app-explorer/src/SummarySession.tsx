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

function renderSession ({ session_info, t, withSession = true }: Props): React.ReactNode {
  if (!withSession || !session_info) {
    return null;
  }

  const label = session_info.isEpoch && session_info.sessionLength.gtn(1)
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

function renderEra ({ session_info, t, withEra = true }: Props): React.ReactNode {
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

function SummarySession (props: Props): React.ReactElement<Props> {
  return (
    <>
      {renderSession(props)}
      {renderEra(props)}
    </>
  );
}

export default translate(
  withCalls<Props>(
    'derive.session.info'
  )(SummarySession)
);
