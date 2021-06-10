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

function extractContributors (keys: StorageKey[], allAccountsHex: string[], ss58Format?: number): Contributions {
  const contributorsHex = keys.map((k) => k.toHex());
  const myAccountsHex = contributorsHex.filter((c) => allAccountsHex.includes(c));

  return {
    contributorsHex,
    myAccounts: myAccountsHex.map((a) => encodeAddress(a, ss58Format)),
    myAccountsHex,
    myContributions: {}
  };
}

function extractDelta (api: ApiPromise, events: EventRecord[], prev: Contributions, allAccountsHex: string[], ss58Format?: number): Contributions {
  const removed = events
    .filter(({ event }) => api.events.crowdloan.Withdrew.is(event))
    .map(({ event: { data: [accountId] } }) => accountId.toHex());
  const contributorsHex = prev.contributorsHex.filter((h) => !removed.includes(h));

  events
    .filter(({ event }) => api.events.crowdloan.Contributed.is(event))
    .forEach(({ event: { data: [accountId] } }): void => {
      contributorsHex.push(accountId.toHex());
    });

  const myAccountsHex = contributorsHex.filter((c) => allAccountsHex.includes(c));

  return {
    contributorsHex,
    myAccounts: myAccountsHex.map((a) => encodeAddress(a, ss58Format)),
    myAccountsHex,
    myContributions: {}
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

export default function useContributions (paraId: ParaId, childKey: string): Contributions {
  const { api } = useApi();
  const { allAccountsHex } = useAccounts();
  const [state, _setState] = useState<Contributions>(() => NO_CONTRIB);
  const myContributions = useMyContributions(paraId, childKey, state.myAccountsHex);

  // these trigger a full refresh of the keys
  const triggerAll = useEventTrigger([
    api.events.crowdloan.Dissolved,
    api.events.crowdloan.AllRefunded,
    api.events.crowdloan.PartiallyRefunded
  ], useCallback(
    ({ event: { data: [eventParaId] } }: EventRecord) =>
      eventParaId.eq(paraId),
    [paraId]
  ));

  // these trigger a delta adjustment
  const triggerDelta = useEventTrigger([
    api.events.crowdloan.Contributed,
    api.events.crowdloan.Withdrew
  ], useCallback(
    ({ event: { data: [, eventParaId] } }: EventRecord) =>
      eventParaId.eq(paraId),
    [paraId]
  ));

  const setState = useCallback(
    (fn: (prev: Contributions) => Contributions) =>
      _setState((prev) => {
        const { contributorsHex, myAccounts, myAccountsHex } = fn(prev);

        return {
          ...prev,
          contributorsHex,
          ...(prev.myAccounts.length === myAccounts.length
            ? {}
            : { myAccounts, myAccountsHex }
          )
        };
      }),
    []
  );

  useEffect((): void => {
    triggerAll &&
      api.rpc.childstate
        .getKeys(childKey, '0x')
        .then((keys) =>
          setState(() =>
            extractContributors(keys, allAccountsHex, api.registry.chainSS58)
          )
        )
        .catch(console.error);
  }, [allAccountsHex, api, childKey, setState, triggerAll]);

  useEffect((): void => {
    triggerDelta && triggerDelta.events.length &&
      setState((prev) =>
        extractDelta(api, triggerDelta.events, prev, allAccountsHex, api.registry.chainSS58)
      );
  }, [api, allAccountsHex, setState, triggerDelta]);

  useEffect((): void => {
    // no deltas, set directly here
    _setState((prev) => ({
      ...prev,
      myContributions
    }));
  }, [myContributions]);

  return state;
}
