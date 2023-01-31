// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import useSessionInfo from './useSessionInfo';
import useValidatorsActive from './useValidatorsActive';
import Validators from './Validators';

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const sessionInfo = useSessionInfo();
  const validatorsActive = useValidatorsActive(favorites, sessionInfo);

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
            validatorsActive={validatorsActive}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(StakingApp);
