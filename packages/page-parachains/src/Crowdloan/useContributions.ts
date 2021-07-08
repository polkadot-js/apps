// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveContributions } from '@polkadot/api-derive/types';
import type { Balance, ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { encodeAddress } from '@polkadot/util-crypto';

interface Result extends DeriveContributions {
  hasLoaded: boolean;
  myAccounts: string[];
  myAccountsHex: string[];
  myContributions: Record<string, Balance>;
}

const NO_CONTRIB: Result = {
  blockHash: '-',
  childKey: '',
  contributorsAdded: [],
  contributorsHex: [],
  contributorsMap: {},
  contributorsRemoved: [],
  hasLoaded: false,
  myAccounts: [],
  myAccountsHex: [],
  myContributions: {}
};

function useMyContributions (childKey: string, keys: string[]): Record<string, Balance> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Record<string, Balance>>({});

  useEffect((): void => {
    if (childKey && keys.length) {
      Promise
        .all(keys.map((k) => api.rpc.childstate.getStorage(childKey, k)))
        .then((values) =>
          mountedRef.current && setState(
            values
              .map((v) => api.createType('Option<StorageData>', v))
              .map((o) =>
                o.isSome
                  ? api.createType('Balance', o.unwrap())
                  : api.createType('Balance')
              )
              .reduce((all, b, index) => ({ ...all, [keys[index]]: b }), {})
          )
        )
        .catch(console.error);
    } else {
      setState({});
    }
  }, [api, childKey, keys, mountedRef]);

  return state;
}

export default function useContributions (paraId: ParaId): Result {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, setState] = useState<Result>(() => NO_CONTRIB);
  const derive = useCall<DeriveContributions>(api.derive.crowdloan.contributions, [paraId]);
  const myContributions = useMyContributions(state.childKey, state.myAccountsHex);

  useEffect((): void => {
    derive && setState((prev): Result => {
      let myAccountsHex = derive.contributorsHex.filter((h) => allAccountsHex.includes(h));
      let myAccounts: string[];

      if (myAccountsHex.length === prev.myAccountsHex.length) {
        myAccountsHex = prev.myAccountsHex;
        myAccounts = prev.myAccounts;
      } else {
        myAccounts = myAccountsHex.map((a) => encodeAddress(a, api.registry.chainSS58));
      }

      return { ...prev, ...derive, hasLoaded: true, myAccounts, myAccountsHex };
    });
  }, [api, allAccountsHex, derive]);

  useEffect((): void => {
    myContributions && setState((prev) => ({
      ...prev,
      myContributions
    }));
  }, [myContributions]);

  return state;
}
