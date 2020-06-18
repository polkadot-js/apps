// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { Forcing } from '@polkadot/types/interfaces';

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
  const forcing = useCall<Forcing>(api.query.staking?.forceEra, []);
  const eraLabel = useMemo(() =>
    t<string>('era')
  , [t]);
  const sessionLabel = useMemo(() =>
    sessionInfo?.isEpoch
      ? t<string>('epoch')
      : t<string>('session')
  , [sessionInfo?.isEpoch, t]);

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
          {forcing && !forcing.isForceNone && withEra && (
            sessionInfo.sessionLength.gtn(1)
              ? (
                <CardSummary
                  label={eraLabel}
                  progress={{
                    total: forcing.isForceAlways ? sessionInfo.sessionLength : sessionInfo.eraLength,
                    value: forcing.isForceAlways ? sessionInfo.sessionProgress : sessionInfo.eraProgress,
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
