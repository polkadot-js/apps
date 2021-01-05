// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';

import { useMemo } from 'react';

export default function useOwnNominators (ownStashes?: StakerState[]): StakerState[] | undefined {
  return useMemo(
    () => ownStashes && ownStashes.filter(({ isOwnController, isStashValidating }) => isOwnController && !isStashValidating),
    [ownStashes]
  );
}
