// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import Pools from './Pools/index.js';
import Validators from './Validators/index.js';
import { STORE_FAVS_BASE } from './constants.js';
import { useTranslation } from './translate.js';
import { clearCache } from './useCache.js';
import useSessionInfo from './useSessionInfo.js';

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  // on unmount anything else, ensure that for the next round we
  // are starting with a fresh cache (there could be large delays)
  // between opening up staking (executed inline, not via effect)
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
      text: t('Validators')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t('Pools')
    }
  ]);

  return (
    <main className='staking--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Pools />
            }
            path='pools'
          />
          <Route
            element={
              <Validators
                favorites={favorites}
                isRelay={isRelay}
                sessionInfo={sessionInfo}
                toggleFavorite={toggleFavorite}
              />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(StakingApp);
