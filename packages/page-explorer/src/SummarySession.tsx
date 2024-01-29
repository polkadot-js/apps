// Copyright 2017-2024 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';

import React, {useEffect, useState} from 'react';

import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Elapsed } from '@polkadot/react-query';
import { BN_THREE, BN_TWO, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate.js';
import BN from 'bn.js';

interface Props {
  className?: string;
  withEra?: boolean;
  withSession?: boolean;
}

function SummarySession ({ className, withEra = true, withSession = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [eraProgress, setEraProgress] = useState<number>(0)
  const [eraLength, setEraLength] = useState<number>(0)
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);
  const forcing = useCall<Forcing>(api.query.xStaking?.forceEra);

  const sessionLength = api.consts?.babe?.epochDuration
  const sessionsPerEra = useCall<BN>(api.query?.xStaking?.sessionsPerEra)
  const currentIndex = useCall<BN>(api.query?.session?.currentIndex)
  const activeEra = useCall<BN>(api.query?.xStaking?.activeEra)

  const currentSlot = useCall<BN>(api.query.babe.currentSlot)
  const epochIndex = useCall<BN>(api.query.babe.epochIndex)
  const genesisSlot = useCall<BN>(api.query.babe.genesisSlot)

  const erasStartSessionIndex = useCall<BN>(activeEra && api.query?.xStaking?.erasStartSessionIndex, [(activeEra?.toJSON() as any)?.index])

  useEffect(() => {
    if (sessionLength && sessionsPerEra) {
      setEraLength(sessionsPerEra.mul(sessionLength)?.toNumber())
    }
    if (sessionLength && currentIndex && currentSlot && epochIndex && genesisSlot && erasStartSessionIndex) {
      const epochStartSlot = epochIndex?.mul(sessionLength).iadd(genesisSlot);

      if (epochStartSlot) {
        const sessionProgress = currentSlot?.sub(epochStartSlot);

        if (sessionProgress) {
          const eraProgress = currentIndex.sub(new BN(erasStartSessionIndex?.toJSON())).imul(sessionLength).iadd(sessionProgress)
          setEraProgress(eraProgress?.toNumber())
        }
      }

    }
  }, [currentIndex, currentSlot, sessionLength, sessionsPerEra, epochIndex, genesisSlot, erasStartSessionIndex])

  const eraLabel = t('era');
  const sessionLabel = api.query.babe
    ? t('epoch')
    : t('session');
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
                        // : sessionInfo.eraLength
                        : new BN(eraLength)
                      : BN_THREE,
                    value: sessionInfo && forcing
                      ? forcing.isForceAlways
                        ? sessionInfo.sessionProgress
                        // : sessionInfo.eraProgress
                        : new BN(eraProgress)
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
                      &nbsp;{t('elapsed')}
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
