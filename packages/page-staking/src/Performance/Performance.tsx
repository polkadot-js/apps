// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';

import { DeriveEraExposure } from '@polkadot/api-derive/types';
import { MarkWarning, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import { SessionEra } from './index';
import Summary from './Summary';
import useSessionCommitteePerformance, { parseSessionBlockCount, ValidatorPerformance } from './useCommitteePerformance';

interface Props {
  sessionEra: SessionEra,
}

export interface EraValidatorPerformance {
  validatorPerformance: ValidatorPerformance;
  isCommittee: boolean;
}

function parsePerformanceCommittee(currentSessionMode: boolean, sessionValidatorBlockCountLookup: [string, number][], committeePerformance: ValidatorPerformance) {
  if (currentSessionMode && sessionValidatorBlockCountLookup.length > 0) {
    const maybeBlockCount = sessionValidatorBlockCountLookup.find(([id]) => id === committeePerformance.accountId);
    const blockCount = maybeBlockCount ? maybeBlockCount[1] : 0;

    return {
      isCommittee: true,
      validatorPerformance: {
        accountId: committeePerformance.accountId,
        blockCount,
        expectedBlockCount: committeePerformance.expectedBlockCount
      }
    };
  }

  return {
    isCommittee: true,
    validatorPerformance: committeePerformance
  };
}

function Performance ({ sessionEra }: Props): React.ReactElement<Props> {
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

  const eraValidatorPerformances: EraValidatorPerformance[] = useMemo(() => {
    if (!sessionCommitteePerformance) {
        return [];
    }
    const committeePerformances = sessionCommitteePerformance.performance;

    const validatorPerformancesCommittee = committeePerformances.map((committeePerformance) =>
      parsePerformanceCommittee(sessionEra.currentSessionMode, sessionValidatorBlockCountLookup, committeePerformance)
    );
    const committeeAccountIds = committeePerformances.map((performance) => performance.accountId);
    const nonCommitteeAccountIds = eraValidators.filter((validator) => !committeeAccountIds.find((value) => validator === value));
    const validatorPerformancesNonCommittee = nonCommitteeAccountIds.map((accountId) => {
      return {
        isCommittee: false,
        validatorPerformance: {
          accountId,
          blockCount: 0,
          expectedBlockCount: 0
        }
      };
    });

    return validatorPerformancesCommittee.concat(validatorPerformancesNonCommittee);

  },
  [sessionCommitteePerformance, eraValidators, sessionValidatorBlockCountLookup, sessionEra]

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
             eraValidatorPerformances={eraValidatorPerformances}
             session={sessionEra.session}
           />
           <ActionsBanner />
           <CurrentList
             eraValidatorPerformances={eraValidatorPerformances}
             session={sessionEra.session}
           />
         </>)}
    </div>
  );
}

export default React.memo(Performance);
