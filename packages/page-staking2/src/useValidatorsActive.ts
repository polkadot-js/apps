// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from './constants';

const OPT_VALIDATORS = {
  transform: (validators: AccountId32[]): string[] =>
    validators.map((a) => a.toString())
};

function sortValidators (favorites: string[], validators: string[]): string[] {
  return validators.sort((a, b) => {
    const isFavA = favorites.includes(a);

    return isFavA === favorites.includes(b)
      ? 0
      : isFavA
        ? -1
        : 1;
  });
}

function useValidatorsActiveImpl (): string[] | undefined {
  const { api } = useApi();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const validators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);

  return useMemo(
    () => validators && sortValidators(favorites, validators),
    [favorites, validators]
  );
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
