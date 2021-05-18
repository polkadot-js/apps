// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId } from './types';

import { useMemo } from 'react';

import { useAccounts } from '@polkadot/react-hooks';

import useAllIds from './useAllIds';

export default function useOwnedIds (): OwnedId[] {
  const { allAccounts } = useAccounts();
  const ids = useAllIds(true);

  return useMemo(
    () => ids.filter((id) => allAccounts.some((a) => a === id.manager)),
    [allAccounts, ids]
  );
}
