// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { H256, Multisig } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useApi, useIncrement, useIsMountedRef } from '@polkadot/react-hooks';
import { Option, StorageKey } from '@polkadot/types';

export default function useMultisigApprovals (address: string): [H256, Multisig][] {
  const { api } = useApi();
  const [multiInfos, setMultiInfos] = useState<[H256, Multisig][]>([]);
  const [trigger] = useIncrement();
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    const multiModule = api.query.multisig || api.query.utility;

    multiModule && multiModule.multisigs &&
      multiModule.multisigs
        .entries(address)
        .then((infos: [StorageKey, Option<Multisig>][]): void => {
          mountedRef.current && setMultiInfos(
            infos
              .filter(([, opt]) => opt.isSome)
              .map(([key, opt]) => [key.args[1] as H256, opt.unwrap()])
          );
        })
        .catch(console.error);
  }, [address, api, mountedRef, trigger]);

  return multiInfos;
}
