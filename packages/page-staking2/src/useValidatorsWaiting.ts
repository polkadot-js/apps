// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Validator } from './types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useValidatorsActive from './useValidatorsActive';
import useValidatorsAll from './useValidatorsAll';

function excludeValidators (from?: Validator[], exclude?: Validator[]): Validator[] | undefined {
  return from && exclude && from.filter(({ stashId }) =>
    !exclude.some((v) => v.stashId === stashId)
  );
}

function useValidatorsWaitingImpl (favorites: string[], currentEra: BN | null): Validator[] | undefined {
  const activeValidators = useValidatorsActive(favorites, currentEra);
  const allValidators = useValidatorsAll(favorites, currentEra);

  return useMemo(
    () => excludeValidators(allValidators, activeValidators),
    [activeValidators, allValidators]
  );
}

export default createNamedHook('useValidatorsWaiting', useValidatorsWaitingImpl);
