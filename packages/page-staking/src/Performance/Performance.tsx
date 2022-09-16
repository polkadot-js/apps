// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { MarkWarning, Spinner } from '@polkadot/react-components';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import { SessionEra } from './index';
import Summary from './Summary';
import useValidatorPerformance from "@polkadot/app-staking/Performance/useValidatorPerformance";

interface Props {
  favorites: string[];
  toggleFavorite: (address: string) => void;
  sessionEra: SessionEra,
}

export interface ValidatorPerformance {
  accountId: string,
  blockCount: number,
  expectedBlockCount: number,
  isCommittee: boolean;
  isFavourite: boolean,
}

function Performance ({ favorites, sessionEra, toggleFavorite }: Props): React.ReactElement<Props>  {

  const [validatorPerformances, committee, isPalletElectionsSupported] = useValidatorPerformance({favorites, sessionEra});

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
             committee={committee}
             era={sessionEra.era}
             session={sessionEra.session}
             validatorPerformances={validatorPerformances}
           />
           <ActionsBanner />
           <CurrentList
             session={sessionEra.session}
             toggleFavorite={toggleFavorite}
             validatorPerformances={validatorPerformances}
           />
         </>)}
    </div>
  );
}

export default Performance;
