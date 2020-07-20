// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryableStorageEntry } from '@polkadot/api/types';
import { Codec } from '@polkadot/types/types';
import { EthereumAddress } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

export default function usePolkadotPreclaims (): string[] {
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
