/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { EraPoints } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { BlockAuthorsContext } from '@polkadot/react-query';

import CurrentList from './CurrentList';
import Summary from './Summary';

interface Props extends BareProps, ComponentProps {
  eraPoints?: EraPoints;
}

export default function Overview (props: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const { byAuthor, lastBlockAuthor, lastBlockNumber } = useContext(BlockAuthorsContext);
  const [nextSorted, setNextSorted] = useState<string[]>([]);
  const { allControllers, allStashes, currentValidators, eraPoints, recentlyOnline } = props;

  useEffect((): void => {
    setNextSorted(
      isSubstrateV2
        // this is a V2 node currentValidators is a list of stashes
        ? allStashes.filter((address): boolean => !currentValidators.includes(address))
        // this is a V1 node currentValidators is a list of controllers
        : allControllers.filter((address): boolean => !currentValidators.includes(address))
    );
  }, [allControllers, allStashes, currentValidators]);

  return (
    <div className='staking--Overview'>
      <Summary
        allControllers={allControllers}
        currentValidators={currentValidators}
        lastBlock={lastBlockNumber}
        lastAuthor={lastBlockAuthor}
        next={nextSorted}
      />
      <CurrentList
        authorsMap={byAuthor}
        currentValidators={currentValidators}
        eraPoints={eraPoints}
        lastAuthor={lastBlockAuthor}
        next={nextSorted}
        recentlyOnline={recentlyOnline}
      />
    </div>
  );
}
