// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { SessionInfo, Validator } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { useCacheValue } from './useCache';
import useTaggedValidators from './useTaggedValidators';

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

function useValidatorsActiveImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const { api } = useApi();
  const sessionValidators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);
  const tagged = useTaggedValidators(favorites, sessionInfo, sessionValidators);

  return useCacheValue('useValidatorsActive', tagged);
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
