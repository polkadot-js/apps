// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey } from '@polkadot/types';
import type { AccountId32, EventRecord } from '@polkadot/types/interfaces';
import type { SessionInfo, Validator } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

import { useCacheValue } from './useCache.js';
import useTaggedValidators from './useTaggedValidators.js';

const EMPTY_PARAMS: unknown[] = [];

const OPT_VALIDATORS = {
  transform: (keys: StorageKey<[AccountId32]>[]): AccountId32[] =>
    keys.map(({ args: [id] }) => id)
};

function eventFilter (records: EventRecord[]): Changes<AccountId32> {
  const added: AccountId32[] = [];
  const removed: AccountId32[] = [];

  records.forEach(({ event: { data: [id], method } }): void => {
    if (method === 'Bonded') {
      added.push(id as AccountId32);
    } else {
      removed.push(id as AccountId32);
    }
  });

  return { added, removed };
}

function mapValidators (validators?: AccountId32[]): Validator[] | undefined {
  return validators?.map((a) => {
    const stashId = a.toString();

    return {
      isElected: false,
      isFavorite: false,
      isOwned: false,
      key: `${stashId}::-1`,
      stashId,
      stashIndex: -1
    };
  });
}

function useValidatorsAllImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.staking.validators, EMPTY_PARAMS, OPT_VALIDATORS);

  const validators = useEventChanges([
    api.events.staking.Bonded
  ], eventFilter, startValue);

  const validatorsIndexed = useMemo(
    () => mapValidators(validators),
    [validators]
  );

  const tagged = useTaggedValidators(favorites, sessionInfo, validatorsIndexed);

  return useCacheValue('useValidatorsAll', tagged);
}

export default createNamedHook('useValidatorsAll', useValidatorsAllImpl);
