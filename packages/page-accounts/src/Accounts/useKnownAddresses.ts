// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
