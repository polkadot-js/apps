// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';
import type { BlockNumber } from '@polkadot/types/interfaces';


import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Elapsed } from '@polkadot/react-query';
import { BN_ONE, formatNumber, BN } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  roundInfo:RoundInfo<unknown>
  bestNumberFinalized:BlockNumber|undefined
}

export interface RoundInfo<T> {
    current:T;
    first:T;
    length:T;
  }

function SummaryRound ({ className, roundInfo,bestNumberFinalized}: Props): React.ReactElement<Props> {
//   const { t } = useTranslation();
//   const { api } = useApi();
  // const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);
//   const forcing = useCall<Forcing>(api.query.staking?.forceEra);

//   const eraLabel = t<string>('era');
// //   const sessionLabel = sessionInfo?.isEpoch
// //     ? t<string>('epoch')
// //     : t<string>('session');
//   const activeEraStart = sessionInfo?.activeEraStart.unwrapOr(null);
console.log("length1",roundInfo?.length&&(roundInfo?.length as any).toHuman())
if (roundInfo){
    console.log('yes')
}
console.log("Number(roundInfo.length)",Number(roundInfo?.length))
console.log(' bestNumberFinalized',(bestNumberFinalized))
console.log('number bestNumberFinalized',Number(bestNumberFinalized))
console.log('number first',Number(roundInfo?.first))
console.log('number value',Number(bestNumberFinalized)-Number(roundInfo?.first))
  return (
    <>
      {roundInfo && (
        <>
          {
            // (new BN(roundInfo.length)).gt(BN_ONE)
              // ? 
              (
                <CardSummary
                  className={className}
                  label={"round"}
                  progress={{
                    total: new BN(Number(roundInfo.length)),
                    value: new BN(Number(bestNumberFinalized)-Number(roundInfo.first)),
                    withTime: true
                  }}
                />
              )
            //   : (
            //     <CardSummary label={sessionLabel}>
            //       #{formatNumber(sessionInfo.currentIndex)}
            //       {withEra && activeEraStart && <div className='isSecondary'>&nbsp;</div>}
            //     </CardSummary>
            //   )
          }
          {/* {forcing && !forcing.isForceNone && withEra && (
            sessionInfo.sessionLength.gt(BN_ONE)
              ? (
                <CardSummary
                  className={className}
                  label={eraLabel}
                  progress={{
                    total: forcing.isForceAlways ? sessionInfo.sessionLength : sessionInfo.eraLength,
                    value: forcing.isForceAlways ? sessionInfo.sessionProgress : sessionInfo.eraProgress,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary
                  className={className}
                  label={eraLabel}
                >
                  #{formatNumber(sessionInfo.activeEra)}
                  {activeEraStart && (
                    <Elapsed
                      className='isSecondary'
                      value={activeEraStart}
                    >
                      &nbsp;{t('elapsed')}
                    </Elapsed>
                  )}
                </CardSummary>
              )
          )} */}
        </>
      )}
    </>
  );
}

export default React.memo(SummaryRound);
