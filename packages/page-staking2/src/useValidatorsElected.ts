// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const OPT_VALIDATORS = {
  transform: (keys: StorageKey<[AccountId32]>[]): string[] =>
    keys.map(({ args: [stashId] }) => stashId.toString())
};

function useValidatorsElectedImpl (currentEra: BN | null): string[] | undefined {
  const { api } = useApi();

  const params = useMemo(
    () => currentEra && [currentEra],
    [currentEra]
  );

  return useMapKeys(params && api.query.staking.erasStakers, params, OPT_VALIDATORS);
}

export default createNamedHook('useValidatorsElected', useValidatorsElectedImpl);
