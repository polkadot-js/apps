// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { SessionInfo, Validator } from './types';

import { useEffect } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useTaggedValidators from './useTaggedValidators';

interface Cache {
  activeEra: BN;
  validators: Validator[];
}

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

let cache: Cache | undefined;

function useValidatorsActiveImpl (favorites: string[], sessionInfo: SessionInfo): Validator[] | undefined {
  const { api } = useApi();
  const sessionValidators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);
  const validators = useTaggedValidators(favorites, sessionInfo, sessionValidators);

  useEffect((): void => {
    if (validators && sessionInfo.activeEra) {
      cache = { activeEra: sessionInfo.activeEra, validators };
    }
  }, [sessionInfo, validators]);

  return validators || (
    cache &&
    sessionInfo.activeEra?.eq(cache.activeEra) &&
    cache.validators
  ) || undefined;
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
