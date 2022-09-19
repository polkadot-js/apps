// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useMemo} from 'react';

import { MarkWarning, Spinner } from '@polkadot/react-components';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import { SessionEra } from './index';
import Summary from './Summary';
import useSessionCommitteePerformance, {ValidatorPerformance} from './useCommitteePerformance';
import {useApi, useCall} from "@polkadot/react-hooks";
import {DeriveEraExposure} from "@polkadot/api-derive/types";

interface Props {
  favorites: string[],
  toggleFavorite: (address: string) => void;
  sessionEra: SessionEra,
}

export interface EraValidatorPerformance {
  validatorPerformance: ValidatorPerformance;
  isCommittee: boolean;
}

function Performance ({ favorites, sessionEra, toggleFavorite }: Props): React.ReactElement<Props>  {
  const { api } = useApi();

  const sessionCommitteePerformance = useSessionCommitteePerformance([sessionEra.session])[0];
  const isPalletElectionsSupported = sessionCommitteePerformance.isPalletElectionsSupported;

  const eraExposure = useCall<DeriveEraExposure>(api.derive.staking.eraExposure, [sessionEra.era]);
  const eraValidators = useMemo(() => {
      if (eraExposure?.validators) {
        return Object.keys(eraExposure?.validators);
      }

      return [];
    }, [eraExposure]
  );

  const eraValidatorPerformances: EraValidatorPerformance[]  = useMemo(() => {
      const committeePerformances = sessionCommitteePerformance.performance;
      const validatorPerformancesCommittee = committeePerformances.map((committeePerformance) => {
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
    },
    [sessionCommitteePerformance, eraValidators]

  );

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
             toggleFavorite={toggleFavorite}
             favorites={favorites}
             eraValidatorPerformances={eraValidatorPerformances}
           />
         </>)}
    </div>
  );
}

export default Performance;
