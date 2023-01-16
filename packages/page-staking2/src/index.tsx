// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import useSessionInfo from './useSessionInfo';
import useValidatorsActive from './useValidatorsActive';
import Validators from './Validators';

function splitValidators (favorites: string[], validators?: string[]): { validatorsActive?: string[], validatorsFavorite?: string[] } {
  if (!validators) {
    return {};
  }

  const validatorsFavorite = validators.filter((a) => favorites.includes(a));

  return validatorsFavorite.length
    ? { validatorsActive: validators.filter((a) => !validatorsFavorite.includes(a)), validatorsFavorite }
    : { validatorsActive: validators };
}

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const validators = useValidatorsActive();
  const sessionInfo = useSessionInfo();

  const { validatorsActive, validatorsFavorite } = useMemo(
    () => splitValidators(favorites, validators),
    [favorites, validators]
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
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
            validatorsActive={validatorsActive}
            validatorsFavorite={validatorsFavorite}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(StakingApp);
