// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useAccounts, useAddresses } from '@polkadot/react-hooks';

export default function useKnownAddresses (exclude?: string): string[] {
  const { allAccounts } = useAccounts();
  const { allAddresses } = useAddresses();

  return useMemo(
    () => [...allAccounts, ...allAddresses].filter((a) => a !== exclude),
    [allAccounts, allAddresses, exclude]
  );
}
