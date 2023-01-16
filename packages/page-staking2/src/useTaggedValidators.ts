// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useSortedValidators from './useSortedValidators';
import useValidatorsElected from './useValidatorsElected';

function withElected <T extends Validator> (validators?: T[], elected?: Validator[]): T[] | undefined {
  if (elected) {
    return validators && validators.map((v): T => {
      if (elected.some((e) => e.stashId === v.stashId)) {
        v.isElected = true;
      }

      return v;
    });
  }

  return validators;
}

function useTaggedValidatorsImpl (favorites: string[], currentEra: BN | null, validators?: Validator[]): Validator[] | undefined {
  const elected = useValidatorsElected(currentEra);
  const sorted = useSortedValidators(favorites, validators);

  return useMemo(
    () => withElected(sorted, elected),
    [elected, sorted]
  );
}

export default createNamedHook('useTaggedValidators', useTaggedValidatorsImpl);
