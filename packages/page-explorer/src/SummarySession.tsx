// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Elapsed } from '@polkadot/react-query';
import { BN_THREE, BN_TWO, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  withEra?: boolean;
  withSession?: boolean;
}

function SummarySession ({ className, withEra = true, withSession = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall(api.derive.session?.progress);
  const forcing = useCall(api.query.staking?.forceEra);

  const eraLabel = t<string>('era');
  const sessionLabel = api.query.babe
    ? t<string>('epoch')
    : t<string>('session');
  const activeEraStart = sessionInfo?.activeEraStart.unwrapOr(null);

  return (
    <>
      {api.derive.session && (
        <>
          {withSession && (
            api.query.babe
              ? (
                <CardSummary
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
                <CardSummary label={sessionLabel}>
                  #{sessionInfo
                    ? formatNumber(sessionInfo.currentIndex)
                    : <span className='--tmp'>123</span>}
                  {withEra && activeEraStart && <div className='isSecondary'>&nbsp;</div>}
                </CardSummary>
              )
          )}
          {withEra && (
            api.query.babe
              ? (
                <CardSummary
                  className={className}
                  label={eraLabel}
                  progress={{
                    isBlurred: !(sessionInfo && forcing),
                    total: sessionInfo && forcing
                      ? forcing.isForceAlways
                        ? sessionInfo.sessionLength
                        : sessionInfo.eraLength
                      : BN_THREE,
                    value: sessionInfo && forcing
                      ? forcing.isForceAlways
                        ? sessionInfo.sessionProgress
                        : sessionInfo.eraProgress
                      : BN_TWO,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary
                  className={className}
                  label={eraLabel}
                >
                  #{sessionInfo
                    ? formatNumber(sessionInfo.activeEra)
                    : <span className='--tmp'>123</span>}
                  {activeEraStart && (
                    <Elapsed
                      className={`${sessionInfo ? '' : '--tmp'} isSecondary`}
                      value={activeEraStart}
                    >
                      &nbsp;{t<string>('elapsed')}
                    </Elapsed>
                  )}
                </CardSummary>
              )
          )}
        </>
      )}
    </>
  );
}

export default React.memo(SummarySession);
