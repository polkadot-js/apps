// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useSortedValidators from './useSortedValidators';
import useValidatorsElected from './useValidatorsElected';

function withElected (validators?: Validator[], elected?: Validator[]): Validator[] | undefined {
  return elected
    ? validators && validators.map(({ key, stashId, stashIndex }): Validator => ({
      isElected: elected.some((e) => e.stashId === stashId),
      key,
      stashId,
      stashIndex
    }))
    : validators;
}

function useTaggedValidatorsImpl (favorites: string[], currentEra: BN | null, validators?: Validator[]): Validator[] | undefined {
  const elected = useValidatorsElected(currentEra);

  const flagged = useMemo(
    () => withElected(validators, elected),
    [elected, validators]
  );

  return useSortedValidators(favorites, flagged);
}

export default createNamedHook('useTaggedValidators', useTaggedValidatorsImpl);
