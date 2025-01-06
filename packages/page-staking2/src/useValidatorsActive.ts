// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { SessionInfo, Validator } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { objectSpread } from '@polkadot/util';

import { useCacheValue } from './useCache.js';
import useTaggedValidators from './useTaggedValidators.js';

const OPT_VALIDATORS = {
  transform: (validators: AccountId32[]): Validator[] =>
    validators.map((a, stashIndex) => {
      const stashId = a.toString();

      return {
        isElected: false,
        isFavorite: false,
        isOwned: false,
        key: `${stashId}:${stashIndex}`,
        stashId,
        stashIndex
      };
    })
};

const OPT_INDICES = {
  transform: (indices: u32[]): number[] =>
    indices.map((n) => n.toNumber())
};

function useValidatorsActiveImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const { api } = useApi();
  const sessionValidators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);
  const activeIndices = useCall((api.query.parasShared || api.query.shared)?.activeValidatorIndices, undefined, OPT_INDICES);

  const validatorsWithPara = useMemo(
    () => activeIndices && sessionValidators
      ? sessionValidators.map((v, index) =>
        activeIndices.includes(index)
          ? objectSpread<Validator>({ isPara: true }, v)
          : v
      )
      : sessionValidators,
    [activeIndices, sessionValidators]
  );

  const tagged = useTaggedValidators(favorites, sessionInfo, validatorsWithPara);

  return useCacheValue('useValidatorsActive', tagged);
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
