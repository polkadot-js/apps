// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import { useMemo } from 'react';

export default function useOwnNominators (ownStashes?: StakerState[]): StakerState[] | undefined {
  return useMemo(
    () => ownStashes ? ownStashes.filter(({ isOwnController, isStashValidating }) => isOwnController && !isStashValidating) : undefined,
    [ownStashes]
  );
}
