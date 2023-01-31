// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import { clearCache } from './useCache';
import useSessionInfo from './useSessionInfo';
import Validators from './Validators';

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

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
    }
  ]);

  return (
    <main className='staking--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route>
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
