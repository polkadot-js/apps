// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { CardSummary } from '@polkadot/react-components';
import { useApi, useBlockInterval, useCall, useStakingAsyncApis } from '@polkadot/react-hooks';
import { BN, BN_THREE, BN_TWO, BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  withEra?: boolean;
  withSession?: boolean;
}

function SummarySession ({ className, withEra = true, withSession = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi(); // Asset Hub API
  const blockTime = useBlockInterval();
  const { rcApi } = useStakingAsyncApis();
  const sessionInfo = useCall<DeriveSessionProgress>(rcApi?.derive.session?.progress);
  const ahSessionInfo = useCall<DeriveSessionProgress>(api?.derive.session?.progress);
  const forcing = useCall<Forcing>(rcApi?.query.staking?.forceEra);

  const eraLabel = t('era');
  const sessionLabel = rcApi?.query.babe
    ? t('epoch')
    : t('session');
  const activeEraStart = sessionInfo?.activeEraStart.unwrapOr(null);

  const eraProgress = useMemo(() => {
    if (!ahSessionInfo) {
      return BN_ZERO;
    }

    const currentEraStart = ahSessionInfo.activeEraStart.unwrapOrDefault();

    if (currentEraStart.isZero()) {
      return BN_ZERO;
    }

    const currentTimestamp = new BN(Math.floor(Date.now()));

    const elapsed = currentTimestamp.sub(currentEraStart);

    return elapsed.div(blockTime);
  }, [ahSessionInfo, blockTime]);

  const eraDuration = useMemo(
    () => {
      const epochDuration = rcApi?.consts.babe?.epochDuration;
      const sessionsPerEra = api?.consts.staking?.sessionsPerEra;

      return epochDuration?.mul(sessionsPerEra);
    },
    [api?.consts.staking?.sessionsPerEra, rcApi?.consts.babe?.epochDuration]
  );

  return (
    <>
      {rcApi?.derive.session && (
        <>
          {withSession && (
            rcApi?.query.babe
              ? (
                <CardSummary
                  apiOverride={rcApi}
                  className={className}
                  label={sessionLabel}
                  progress={{
                    isBlurred: !sessionInfo,
                    total: sessionInfo?.sessionLength || BN_THREE,
                    value: sessionInfo?.sessionProgress || BN_TWO,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary
                  apiOverride={rcApi}
                  label={sessionLabel}
                >
                  #{sessionInfo
                    ? formatNumber(sessionInfo.currentIndex)
                    : <span className='--tmp'>123</span>}
                  {withEra && activeEraStart && <div className='isSecondary'>&nbsp;</div>}
                </CardSummary>
              )
          )}
          <CardSummary
            apiOverride={rcApi}
            className={className}
            label={eraLabel}
            progress={{
              isBlurred: !(sessionInfo && forcing),
              total: sessionInfo && forcing
                ? forcing.isForceAlways
                  ? sessionInfo.sessionLength
                  : eraDuration
                : BN_THREE,
              value: sessionInfo && forcing
                ? forcing.isForceAlways
                  ? sessionInfo.sessionProgress
                  : eraProgress
                : BN_TWO,
              withTime: true
            }}
          />
        </>
      )}
    </>
  );
}

export default React.memo(SummarySession);
