// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { BlockAuthorsContext } from '@polkadot/react-query';

import CurrentList from './CurrentList';
import Summary from './Summary';

interface Props extends BareProps, ComponentProps {}

export default function Overview ({ allControllers, allStashes, className, recentlyOnline, stakingOverview }: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const { byAuthor, lastBlockAuthors, lastBlockNumber } = useContext(BlockAuthorsContext);
  const [next, setNext] = useState<string[]>([]);
  const validators = stakingOverview && stakingOverview.validators;

  useEffect((): void => {
    validators && setNext(
      isSubstrateV2
        // this is a V2 node currentValidators is a list of stashes
        ? allStashes.filter((address): boolean => !validators.includes(address as any))
        // this is a V1 node currentValidators is a list of controllers
        : allControllers.filter((address): boolean => !validators.includes(address as any))
    );
  }, [allControllers, allStashes, validators]);

  return (
    <div className={`staking--Overview ${className}`}>
      <Summary
        allControllers={allControllers}
        lastBlock={lastBlockNumber}
        lastAuthors={lastBlockAuthors}
        next={next}
        stakingOverview={stakingOverview}
      />
      <CurrentList
        authorsMap={byAuthor}
        lastAuthors={lastBlockAuthors}
        next={next}
        recentlyOnline={recentlyOnline}
        stakingOverview={stakingOverview}
      />
    </div>
  );
}
