// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  withEra?: boolean;
  withSession?: boolean;
}

function SummarySession ({ withEra = true, withSession = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress, []);
  const eraLabel = useMemo(() =>
    t('era')
  , [t]);
  const sessionLabel = useMemo(() =>
    sessionInfo?.isEpoch
      ? t('epoch')
      : t('session')
  , [sessionInfo, t]);

  return (
    <>
      {sessionInfo && (
        <>
          {withSession && (
            sessionInfo.sessionLength.gtn(1)
              ? (
                <CardSummary
                  label={sessionLabel}
                  progress={{
                    total: sessionInfo.sessionLength,
                    value: sessionInfo.sessionProgress,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary label={sessionLabel}>
                  #{formatNumber(sessionInfo.currentIndex)}
                </CardSummary>
              )
          )}
          {withEra && (
            sessionInfo.sessionLength.gtn(1)
              ? (
                <CardSummary
                  label={eraLabel}
                  progress={{
                    total: sessionInfo.eraLength,
                    value: sessionInfo.eraProgress,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary label={eraLabel}>
                  #{formatNumber(sessionInfo.activeEra)}
                </CardSummary>
              )
          )}
        </>
      )}
    </>
  );
}

export default React.memo(SummarySession);
