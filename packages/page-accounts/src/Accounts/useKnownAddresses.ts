// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import { useAccounts, useAddresses } from '@polkadot/react-hooks';

export default function useKnownAddresses (exclude?: string): string[] {
  const { allAccounts } = useAccounts();
  const { allAddresses } = useAddresses();
  const [known, setKnown] = useState<string[]>([]);

  useEffect((): void => {
    allAccounts && allAddresses && setKnown(
      [...allAccounts, ...allAddresses].filter((a): boolean => a !== exclude)
    );
  }, [allAccounts, allAddresses, exclude]);

  return known;
}
