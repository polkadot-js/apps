// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { SessionInfo, Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const OPT_VALIDATORS = {
  transform: (keys: StorageKey<[AccountId32]>[]): Validator[] =>
    keys.map(({ args: [a] }) => {
      const stashId = a.toString();

      return {
        key: `${stashId}::-1`,
        stashId,
        stashIndex: -1
      };
    })
};

function useValidatorsElectedImpl ({ currentEra }: SessionInfo): Validator[] | undefined {
  const { api } = useApi();

  const params = useMemo(
    () => currentEra && [currentEra],
    [currentEra]
  );

  // NOTE These are not sorted - we generally would combine this into
  // any of the Active, All or Waiting lists, so direct usage
  return useMapKeys(params && api.query.staking.erasStakers, params, OPT_VALIDATORS);
}

export default createNamedHook('useValidatorsElected', useValidatorsElectedImpl);
