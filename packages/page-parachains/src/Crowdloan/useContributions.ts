// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { StorageKey } from '@polkadot/types';
import type { Balance, EventRecord, ParaId } from '@polkadot/types/interfaces';

import { useCallback, useEffect, useState } from 'react';

import { useAccounts, useApi, useEventTrigger } from '@polkadot/react-hooks';
import { encodeAddress } from '@polkadot/util-crypto';

interface Contributions {
  contributorsHex: string[];
  contributorsMap: Record<string, boolean>;
  hasKeys: boolean;
  myAccounts: string[];
  myAccountsHex: string[];
  myContributions: Record<string, Balance>;
}

interface Result extends Contributions {
  blockHash: string;
}

const NO_CONTRIB: Result = {
  blockHash: '-',
  contributorsHex: [],
  contributorsMap: {},
  hasKeys: false,
  myAccounts: [],
  myAccountsHex: [],
  myContributions: {}
};

function extractContributors (keys: StorageKey[], { myContributions }: Contributions, allAccountsHex: string[], ss58Format?: number): Contributions {
  const contributorsMap: Record<string, boolean> = {};

  keys.forEach((k): void => {
    contributorsMap[k.toHex()] = true;
  });

  const myAccountsHex = allAccountsHex.filter((h) => contributorsMap[h]);

  return {
    contributorsHex: Object.keys(contributorsMap),
    contributorsMap,
    hasKeys: true,
    myAccounts: myAccountsHex.map((a) => encodeAddress(a, ss58Format)),
    myAccountsHex,
    myContributions
  };
}

function extractDelta (api: ApiPromise, records: EventRecord[], { contributorsMap, hasKeys, myContributions }: Contributions, allAccountsHex: string[], ss58Format?: number): Contributions {
  records.forEach((record): void => {
    const hex = record.event.data[0].toHex();

    if (api.events.crowdloan.Withdrew.is(record.event)) {
      delete contributorsMap[hex];
    } else {
      contributorsMap[hex] = true;
    }
  });

  const myAccountsHex = allAccountsHex.filter((h) => contributorsMap[h]);

  return {
    contributorsHex: Object.keys(contributorsMap),
    contributorsMap,
    hasKeys,
    myAccounts: myAccountsHex.map((a) => encodeAddress(a, ss58Format)),
    myAccountsHex,
    myContributions
  };
}

function useMyContributions (paraId: ParaId, childKey: string, keys: string[]): Record<string, Balance> {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, setState] = useState<Record<string, Balance>>({});

  const trigger = useEventTrigger([
    api.events.crowdloan.Contributed,
    api.events.crowdloan.Withdrew
  ], useCallback(
    ({ event: { data: [accountId, eventParaId] } }: EventRecord) =>
      eventParaId.eq(paraId) &&
      allAccountsHex.some((a) => accountId.eq(a)),
    [allAccountsHex, paraId]
  ));

  useEffect((): void => {
    if (trigger && keys.length) {
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
    } else {
      setState({});
    }
  }, [api, childKey, keys, trigger]);

  return state;
}

export default function useContributions (paraId: ParaId, childKey: string): Result {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, _setState] = useState<Result>(() => NO_CONTRIB);
  const myContributions = useMyContributions(paraId, childKey, state.myAccountsHex);

  // these trigger a full refresh of the keys [ParaId]
  const triggerAll = useEventTrigger([
    api.events.crowdloan.Dissolved,
    api.events.crowdloan.AllRefunded,
    api.events.crowdloan.PartiallyRefunded
  ], useCallback(
    ({ event: { data: [eventParaId] } }: EventRecord) =>
      eventParaId.eq(paraId),
    [paraId]
  ));

  // these trigger a delta adjustment [AccountId, ParaId, Balance]
  const triggerDelta = useEventTrigger([
    api.events.crowdloan.Contributed,
    api.events.crowdloan.Withdrew
  ], useCallback(
    ({ event: { data: [, eventParaId] } }: EventRecord) =>
      eventParaId.eq(paraId),
    [paraId]
  ));

  const setState = useCallback(
    (blockHash: string, fn: (prev: Contributions) => Contributions) =>
      _setState((prev) => {
        const { contributorsHex, contributorsMap, hasKeys, myAccounts, myAccountsHex } = fn(prev);

        return hasKeys
          ? {
            ...prev,
            blockHash,
            contributorsHex,
            contributorsMap,
            hasKeys,
            ...(prev.myAccounts.length === myAccounts.length
              ? {}
              : { myAccounts, myAccountsHex }
            )
          }
          : prev;
      }),
    []
  );

  // first just adjust deltas
  useEffect((): void => {
    triggerDelta && triggerDelta.events.length &&
      setState(triggerDelta.blockHash, (prev) =>
        extractDelta(api, triggerDelta.events, prev, allAccountsHex, api.registry.chainSS58)
      );
  }, [api, allAccountsHex, setState, triggerDelta]);

  // refreshing the whole map, all keys
  useEffect((): void => {
    triggerAll &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) =>
          setState(triggerAll.blockHash, (prev) =>
            extractContributors(keys, prev, allAccountsHex, api.registry.chainSS58)
          )
        )
        .catch(console.error);
  }, [allAccountsHex, api, childKey, setState, triggerAll]);

  // update when the contribution amounts have changed
  useEffect((): void => {
    _setState((prev) => ({
      ...prev,
      myContributions
    }));
  }, [myContributions]);

  return state;
}
