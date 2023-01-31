// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { SessionInfo, Validator } from './types';

import { useEffect } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

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

let cache: Validator[] | undefined;

function useValidatorsActiveImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const { api } = useApi();
  const validators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);
  const result = useTaggedValidators(favorites, sessionInfo, validators);

  useEffect((): void => {
    if (result) {
      cache = result;
    }
  }, [result]);

  return result || cache;
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
