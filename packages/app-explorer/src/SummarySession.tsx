// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import translate from './translate';
import { formatNumber } from '@polkadot/util';

interface Props extends I18nProps {
  sessionInfo?: DerivedSessionInfo;
  withEra?: boolean;
  withSession?: boolean;
}

function renderSession ({ sessionInfo, t, withSession = true }: Props): React.ReactNode {
  if (!withSession || !sessionInfo) {
    return null;
  }

  const label = sessionInfo.isEpoch && sessionInfo.sessionLength.gtn(1)
    ? t('epoch')
    : t('session');

  return sessionInfo.sessionLength.gtn(0)
    ? (
      <CardSummary
        label={label}
        progress={{
          total: sessionInfo.sessionLength,
          value: sessionInfo.sessionProgress
        }}
      />
    )
    : (
      <CardSummary label={label}>
        {formatNumber(sessionInfo.currentIndex)}
      </CardSummary>
    );
}

function renderEra ({ sessionInfo, t, withEra = true }: Props): React.ReactNode {
  if (!withEra || !sessionInfo) {
    return null;
  }

  const label = t('era');

  return sessionInfo.sessionLength.gtn(0)
    ? (
      <CardSummary
        label={label}
        progress={{
          total: sessionInfo.eraLength,
          value: sessionInfo.eraProgress
        }}
      />
    )
    : (
      <CardSummary label={label}>
        {formatNumber(sessionInfo.currentEra)}
      </CardSummary>
    );
}

function SummarySession (props: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const sessionInfo = useCall<DerivedSessionInfo>(api.derive.session.info, []);
  const [expanded, setExpanded] = useState<Props>(props);

  useEffect((): void => {
    setExpanded({ ...props, sessionInfo });
  }, [props, sessionInfo]);

  return (
    <>
      {renderSession(expanded)}
      {renderEra(expanded)}
    </>
  );
}

export default translate(SummarySession);
