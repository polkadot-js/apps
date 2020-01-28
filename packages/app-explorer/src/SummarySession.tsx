// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedSessionInfo } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  sessionInfo?: DerivedSessionInfo;
  withEra?: boolean;
  withSession?: boolean;
}

function renderSession ({ sessionInfo, withSession = true }: Props, t: (input: string) => string): React.ReactNode {
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

function renderEra ({ sessionInfo, withEra = true }: Props, t: (input: string) => string): React.ReactNode {
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

export default function SummarySession (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DerivedSessionInfo>(api.derive.session?.info, []);
  const [expanded, setExpanded] = useState<Props>(props);

  useEffect((): void => {
    setExpanded({ ...props, sessionInfo });
  }, [props, sessionInfo]);

  return (
    <>
      {renderSession(expanded, t)}
      {renderEra(expanded, t)}
    </>
  );
}
