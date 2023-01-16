// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { Validator } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useTaggedValidators from './useTaggedValidators';

const OPT_VALIDATORS = {
  transform: (validators: AccountId32[]): Validator[] =>
    validators.map((a, stashIndex) => {
      const stashId = a.toString();

      return {
        key: `${stashId}:${stashIndex}`,
        stashId,
        stashIndex
      };
    })
};

function useValidatorsActiveImpl (favorites: string[], currentEra: BN | null): Validator[] | undefined {
  const { api } = useApi();
  const validators = useCall(api.query.session.validators, undefined, OPT_VALIDATORS);

  return useTaggedValidators(favorites, currentEra, validators);
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
