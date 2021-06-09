// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { Balance, EventRecord, ParaId } from '@polkadot/types/interfaces';

import { useCallback, useEffect, useState } from 'react';

import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { encodeAddress } from '@polkadot/util-crypto';

interface Contributions {
  contributorsHex: string[];
  myAccounts: string[];
  myAccountsHex: string[];
  myContributions: Record<string, Balance>;
}

const NO_CONTRIB: Contributions = {
  contributorsHex: [],
  myAccounts: [],
  myAccountsHex: [],
  myContributions: {}
};

function extractContributors (allAccountsHex: string[], keys: StorageKey[], ss58Format?: number): Partial<Contributions> {
  const contributorsHex = keys.map((k) => k.toHex());
  const myAccountsHex = contributorsHex.filter((c) => allAccountsHex.includes(c));

  return {
    contributorsHex,
    myAccounts: myAccountsHex.map((a) => encodeAddress(a, ss58Format)),
    myAccountsHex
  };
}

function useMyContributions (childKey: string, keys: string[]): Record<string, Balance> {
  const { api } = useApi();
  const [state, setState] = useState<Record<string, Balance>>({});

  useEffect((): void => {
    keys.length &&
      Promise
        .all(keys.map((k) => api.rpc.childstate.getStorage(childKey, k)))
        .then((values) => setState(
          values
            .map((v) => api.createType('Option<StorageData>', v))
            .map((o) =>
              o.isSome
                ? api.createType('Balance', o.unwrap())
                : api.createType('Balance')
            )
            .reduce((all, b, index) => ({ ...all, [keys[index]]: b }), {})
        ))
        .catch(console.error);
  }, [api, childKey, keys]);

  return state;
}

export default function useContributions (paraId: ParaId, childKey: string): Contributions {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, setState] = useState<Contributions>(() => NO_CONTRIB);
  const myContributions = useMyContributions(childKey, state.myAccountsHex);

  const trigger = useEventTrigger([
    api.events.crowdloan.Contributed,
    api.events.crowdloan.Withdrew,
    api.events.crowdloan.AllRefunded,
    api.events.crowdloan.PartiallyRefunded
  ], useCallback(
    ({ event: { data } }: EventRecord) =>
      ((data.length === 1
        ? data[0] // AllRefunded, PartiallyRefunded [ParaId]
        : data[1] // Contributed, Withdrew [AccountId, ParaId, Balance]
      ) as ParaId).eq(paraId),
    [paraId]
  ));

  useEffect((): void => {
    trigger &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) => setState((prev) => ({
          ...prev,
          ...extractContributors(allAccountsHex, keys, api.registry.chainSS58)
        })))
        .catch(console.error);
  }, [allAccountsHex, api, childKey, trigger]);

  useEffect((): void => {
    setState((prev) => ({
      ...prev,
      myContributions
    }));
  }, [myContributions]);

  return state;
}
