// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { Option } from '@polkadot/types';
import type { EthereumAddress } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function usePolkadotPreclaimsImpl (): string[] {
  const { allAccounts } = useAccounts();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [needsAttest, setNeedsAttest] = useState<string[]>([]);

  // find all own preclaims
  const preclaims = useCall<[string, EthereumAddress][]>(api.query.claims?.preclaims?.multi, [allAccounts], {
    transform: (preclaims: Option<EthereumAddress>[]) =>
      preclaims
        .map((opt, index): [string, Option<EthereumAddress>] => [allAccounts[index], opt])
        .filter(([, opt]) => opt.isSome)
        .map(([address, opt]) => [address, opt.unwrap()])
  });

  // Filter the accounts that need attest. They are accounts that
  // - already preclaimed
  // - has a balance, either vested or normal
  useEffect((): void => {
    preclaims && api.queryMulti(
      preclaims.reduce((result: [QueryableStorageEntry<'promise'>, EthereumAddress][], [, ethAddr]) =>
        result.concat([
          [api.query.claims.claims, ethAddr],
          [api.query.claims.vesting, ethAddr]
        ]),
      []), (opts: Option<Codec>[]): void => {
        // filter the cases where either claims or vesting has a value
        mountedRef.current && setNeedsAttest(
          preclaims
            .filter((_, index) => opts[index * 2].isSome || opts[(index * 2) + 1].isSome)
            .map(([address]) => address)
        );
      }
    );
  }, [api, allAccounts, mountedRef, preclaims]);

  return needsAttest;
}

export default createNamedHook('usePolkadotPreclaims', usePolkadotPreclaimsImpl);
