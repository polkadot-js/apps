/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { ApiContext } from '@polkadot/react-api';
import { withCalls, withMulti } from '@polkadot/react-api/with';
import { formatNumber } from '@polkadot/util';

import CurrentList from './CurrentList';
import Summary from './Summary';

interface Props extends BareProps, ComponentProps {
  chain_subscribeNewHeads?: HeaderExtended;
}

function Overview (props: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [{ lastAuthor, lastBlock }, setLast] = useState({ lastAuthor: '', lastBlock: '' });
  const [nextSorted, setNextSorted] = useState<string[]>([]);
  const { chain_subscribeNewHeads, allControllers, allStashes, currentValidators, recentlyOnline } = props;

  useEffect((): void => {
    chain_subscribeNewHeads && setLast({
      lastAuthor: (chain_subscribeNewHeads.author || '').toString(),
      lastBlock: formatNumber(chain_subscribeNewHeads.number)
    });
  }, [chain_subscribeNewHeads]);

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
        lastBlock={lastBlock}
        lastAuthor={lastAuthor}
        next={nextSorted}
      />
      <CurrentList
        currentValidators={currentValidators}
        lastBlock={lastBlock}
        lastAuthor={lastAuthor}
        next={nextSorted}
        recentlyOnline={recentlyOnline}
      />
    </div>
  );
}

export default withMulti(
  Overview,
  withCalls<Props>(
    'derive.chain.subscribeNewHeads'
  )
);
