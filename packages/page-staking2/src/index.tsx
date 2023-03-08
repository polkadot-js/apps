// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { STORE_FAVS_BASE } from './constants.js';
import Pools from './Pools.js';
import { useTranslation } from './translate.js';
import { clearCache } from './useCache.js';
import useSessionInfo from './useSessionInfo.js';
import Validators from './Validators.js';

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    bags: `${basePath}/bags`,
    payout: `${basePath}/payout`,
    pools: `${basePath}/pools`,
    query: [
      `${basePath}/query/:value`,
      `${basePath}/query`
    ],
    slashes: `${basePath}/slashes`,
    targets: `${basePath}/targets`
  };
}

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const pathRef = useRef(createPathRef(basePath));

  // on unmount anything else, ensure that for the next round we
  // are starting with a fresh cache (there could be large delays)
  // between opening up staking (excuted inline, not via effect)
  useEffect((): () => void => {
    return (): void => {
      clearCache();
    };
  }, []);

  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const sessionInfo = useSessionInfo();

  const isRelay = useMemo(
    () => !!(api.query.parasShared || api.query.shared)?.activeValidatorIndices,
    [api]
  );

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'sign',
      text: t<string>('Validators')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t<string>('Pools')
    }
  ]);

  return (
    <main className='staking--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route path={pathRef.current.pools}>
          <Pools />
        </Route>
        <Route path={basePath}>
          <Validators
            favorites={favorites}
            isRelay={isRelay}
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(StakingApp);
