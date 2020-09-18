// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StakerState } from '@polkadot/react-hooks/types';

import { useMemo } from 'react';

export default function useOwnNominators (ownStashes?: StakerState[]): StakerState[] | undefined {
  return useMemo(
    () => ownStashes ? ownStashes.filter(({ isOwnController, isStashValidating }) => isOwnController && !isStashValidating) : undefined,
    [ownStashes]
  );
}
