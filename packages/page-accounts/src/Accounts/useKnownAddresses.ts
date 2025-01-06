// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook, useKeyring } from '@polkadot/react-hooks';

function merge (result: string[], input: string[], exclude?: string): string[] {
  return input.reduce<string[]>((result, a) => {
    if (a !== exclude && !result.includes(a)) {
      result.push(a);
    }

    return result;
  }, result);
}

function useKnownAddressesImpl (exclude?: string): string[] {
  const { accounts: { allAccounts }, addresses: { allAddresses } } = useKeyring();

  return useMemo(
    () => merge(merge([], allAccounts, exclude), allAddresses, exclude),
    [allAccounts, allAddresses, exclude]
  );
}

export default createNamedHook('useKnownAddresses', useKnownAddressesImpl);
