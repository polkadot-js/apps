// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

function useOwnNominatorsImpl (ownStashes?: StakerState[]): StakerState[] | undefined {
  return useMemo(
    () => ownStashes?.filter(({ isOwnController, isStashValidating }) =>
      isOwnController &&
      !isStashValidating
    ),
    [ownStashes]
  );
}

export default createNamedHook('useOwnNominators', useOwnNominatorsImpl);
