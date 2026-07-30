// Copyright 2017-2026 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { AccountId, StorageData } from '@polkadot/types/interfaces';
import type { StakerState } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { u8aConcat, u8aToHex } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { useIsMountedRef } from './useIsMountedRef.js';
import { useOwnStashes } from './useOwnStashes.js';

// The raw `staking.validators` storage value for a stash, as returned by
// state_subscribeStorage - `isNone` when the stash has no entry, i.e. is not validating
type ValidatorInfo = Option<StorageData>;
type Queried = Record<string, [boolean, DeriveStakingAccount, ValidatorInfo]>;

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

const QUERY_OPTS = {
  withClaimedRewardsEras: true,
  withDestination: true,
  withLedger: true,
  withNominations: true,
  withPrefs: true
};

function getStakerState (stashId: string, allAccounts: string[], [isOwnStash, { claimedRewardsEras, controllerId: _controllerId, exposureMeta, exposurePaged, nextSessionIds: _nextSessionIds, nominators, rewardDestination, sessionIds: _sessionIds, stakingLedger, validatorPrefs }, validateInfo]: [boolean, DeriveStakingAccount, ValidatorInfo]): StakerState {
  const isStashNominating = !!(nominators?.length);
  // `staking.validators` is a ValueQuery map, so a non-validator returns a default
  // `ValidatorPrefs` that is indistinguishable from a real 0%-commission validator -
  // test for the presence of the storage entry instead of the emptiness of its value
  const isStashValidating = !validateInfo.isNone;
  const nextSessionIds = _nextSessionIds instanceof Map
    ? [..._nextSessionIds.values()]
    : _nextSessionIds;
  const nextConcat = u8aConcat(...nextSessionIds.map((id) => id.toU8a()));
  const sessionIds = _sessionIds instanceof Map
    ? [..._sessionIds.values()]
    : _sessionIds;
  const currConcat = u8aConcat(...sessionIds.map((id) => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    claimedRewardsEras,
    controllerId,
    destination: rewardDestination,
    exposureMeta,
    exposurePaged,
    hexSessionIdNext: u8aToHex(nextConcat, 48),
    hexSessionIdQueue: u8aToHex(currConcat.length ? currConcat : nextConcat, 48),
    isLoading: false,
    isOwnController: allAccounts.includes(controllerId || ''),
    isOwnStash,
    isStashNominating,
    isStashValidating,
    // we assume that all ids are non-null
    nominating: nominators?.map(toIdString) as string[],
    sessionIds: (
      nextSessionIds.length
        ? nextSessionIds
        : sessionIds
    ).map(toIdString) as string[],
    stakingLedger,
    stashId,
    validatorPrefs
  };
}

function useOwnStashInfosImpl (apiOverride?: ApiPromise): StakerState[] | undefined {
  const { api: connectedApi } = useApi();
  const api = useMemo(() => apiOverride ?? connectedApi, [apiOverride, connectedApi]);
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const ownStashes = useOwnStashes(undefined, api);
  const [queried, setQueried] = useState<Queried | undefined>();

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (ownStashes) {
      if (ownStashes.length) {
        const stashIds = ownStashes.map(([stashId]) => stashId);
        // One single-key subscription per stash, rather than one request for all the
        // keys: state_subscribeStorage only falls back to its internal per-key cache
        // when a request carries more than one key, and that cache is shared with the
        // typed staking.validators reads the derive above performs on these very keys -
        // so a multi-key request here intermittently yields a decoded ValidatorPrefs
        // (which has no isNone) in place of the raw optional value
        const fns = [
          [api.derive.staking.accounts, stashIds, QUERY_OPTS],
          ...stashIds.map((stashId) => [api.rpc.state.subscribeStorage, [api.query.staking.validators.key(stashId)]])
        ] as unknown as CombinatorFunction[];

        api.combineLatest<[DeriveStakingAccount[], ...ValidatorInfo[][]]>(fns, ([accounts, ...validators]): void => {
          mountedRef.current && ownStashes.length === accounts.length && ownStashes.length === validators.length && setQueried(
            ownStashes.reduce((queried: Queried, [stashId, isOwnStash], index): Queried => ({
              ...queried,
              [stashId]: [isOwnStash, accounts[index], validators[index][0]]
            }), {})
          );
        }).then((u): void => {
          unsub = u;
        }).catch(console.error);
      } else {
        mountedRef.current && setQueried({});
      }
    }

    return (): void => {
      unsub && unsub();
    };
  }, [api, mountedRef, ownStashes]);

  return useMemo(
    () => ownStashes && queried && ownStashes.length === Object.keys(queried).length
      ? ownStashes
        .filter(([stashId]) => queried[stashId])
        .map(([stashId]) => getStakerState(stashId, allAccounts, queried[stashId]))
      : undefined,
    [allAccounts, ownStashes, queried]
  );
}

export const useOwnStashInfos = createNamedHook('useOwnStashInfos', useOwnStashInfosImpl);
