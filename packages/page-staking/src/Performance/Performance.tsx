// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useMemo, useState} from 'react';

import { MarkWarning, Spinner } from '@polkadot/react-components';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import { SessionEra } from './index';
import Summary from './Summary';
import useSessionCommitteePerformance, {parseSessionBlockCount, ValidatorPerformance} from './useCommitteePerformance';
import {useApi, useCall} from "@polkadot/react-hooks";
import {DeriveEraExposure} from "@polkadot/api-derive/types";

interface Props {
  sessionEra: SessionEra,
}

export interface EraValidatorPerformance {
  validatorPerformance: ValidatorPerformance;
  isCommittee: boolean;
}

function Performance ({ sessionEra }: Props): React.ReactElement<Props>  {
  const { api } = useApi();

  const staticSessionCommitteePerformance = useSessionCommitteePerformance([sessionEra.session]);
  const [sessionValidatorBlockCountLookup, setSessionValidatorBlockCountLookup] = useState<[string, number][]>([]);

  const sessionCommitteePerformance = useMemo(() => {
      if (staticSessionCommitteePerformance && staticSessionCommitteePerformance.length > 0) {
        return staticSessionCommitteePerformance[0];
      }
      return undefined;
    }, [staticSessionCommitteePerformance]
  );
  const isPalletElectionsSupported = sessionCommitteePerformance?.isPalletElectionsSupported;
  const firstBlockAuthor = sessionCommitteePerformance?.firstSessionBlockAuthor;


  const eraExposure = useCall<DeriveEraExposure>(api.derive.staking.eraExposure, [sessionEra.era]);
  const eraValidators = useMemo(() => {
      if (eraExposure?.validators) {
        return Object.keys(eraExposure?.validators);
      }

      return [];
    }, [eraExposure]
  );

  const eraValidatorPerformances: EraValidatorPerformance[]  = useMemo(() => {
    if (sessionCommitteePerformance) {
      const committeePerformances = sessionCommitteePerformance.performance;
      const validatorPerformancesCommittee = committeePerformances.map((committeePerformance) => {
        if (sessionEra.currentSessionMode && sessionValidatorBlockCountLookup.length > 0) {
          let maybeBlockCount = sessionValidatorBlockCountLookup.find(([id]) => id === committeePerformance.accountId);
          let blockCount = maybeBlockCount ? maybeBlockCount[1] : 0;
          return {
            validatorPerformance: {
              accountId: committeePerformance.accountId,
              expectedBlockCount: committeePerformance.expectedBlockCount,
              blockCount: blockCount,
            },
            isCommittee: true,
          }
        }
        return {
          validatorPerformance: committeePerformance,
          isCommittee: true,
        }
      });
      const committeeAccountIds = committeePerformances.map((performance) => performance.accountId);
      const nonCommitteeAccountIds = eraValidators.filter((validator) => !committeeAccountIds.find((value) => validator === value));
      const validatorPerformancesNonCommittee = nonCommitteeAccountIds.map((accountId) => {
        return {
          validatorPerformance: {
            accountId: accountId,
            blockCount: 0,
            expectedBlockCount: 0,
          },
          isCommittee: false,
        }
      });

      return validatorPerformancesCommittee.concat(validatorPerformancesNonCommittee);
    }
    return  [];
    },
    [sessionCommitteePerformance, eraValidators, sessionValidatorBlockCountLookup]

  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (firstBlockAuthor && sessionEra.currentSessionMode) {
        api && api.query.elections && api.query.elections.sessionValidatorBlockCount &&
        api.query.elections.sessionValidatorBlockCount.entries().then((value) => {
          setSessionValidatorBlockCountLookup(parseSessionBlockCount(value, firstBlockAuthor));
        }
        ).catch(console.error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [api, firstBlockAuthor, sessionEra]);

  return (
    <div className='staking--Performance'>
      {isPalletElectionsSupported === undefined && <Spinner label={'Checking storage version'} />}
      {!isPalletElectionsSupported !== undefined && !isPalletElectionsSupported &&
         <MarkWarning
           className='warning centered'
           content={<>Unsupported pallet elections storage version. Choose more recent session number.</>}
         />}
      {isPalletElectionsSupported &&
         (<>
           <Summary
             era={sessionEra.era}
             session={sessionEra.session}
             eraValidatorPerformances={eraValidatorPerformances}
           />
           <ActionsBanner />
           <CurrentList
             session={sessionEra.session}
             eraValidatorPerformances={eraValidatorPerformances}
           />
         </>)}
    </div>
  );
}

export default Performance;
