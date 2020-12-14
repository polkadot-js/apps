// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { AccountId, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { Codec, ITuple } from '@polkadot/types/types';
import type { StakerState } from './types';

import { useEffect, useMemo, useState } from 'react';

import { u8aConcat, u8aToHex } from '@polkadot/util';

import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useIsMountedRef } from './useIsMountedRef';
import { useOwnStashes } from './useOwnStashes';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;
type Queried = Record<string, [boolean, DeriveStakingAccount, ValidatorInfo]>;

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

function getStakerState (stashId: string, allAccounts: string[], [isOwnStash, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }, validateInfo]: [boolean, DeriveStakingAccount, ValidatorInfo]): StakerState {
  const isStashNominating = !!(nominators?.length);
  const isStashValidating = !(Array.isArray(validateInfo) ? validateInfo[1].isEmpty : validateInfo.isEmpty);
  const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: rewardDestination,
    exposure,
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

export function useOwnStashInfos (): StakerState[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const ownStashes = useOwnStashes();
  const [queried, setQueried] = useState<Queried | undefined>();

  useEffect((): () => void => {
    let unsub: (() => void) | undefined;

    if (ownStashes) {
      if (ownStashes.length) {
        const stashIds = ownStashes.map(([stashId]) => stashId);
        const fns: any[] = [
          [api.derive.staking.accounts as any, stashIds],
          [api.query.staking.validators.multi as any, stashIds]
        ];

        api.combineLatest<[DeriveStakingAccount[], ValidatorInfo[]]>(fns, ([accounts, validators]): void => {
          mountedRef.current && ownStashes.length === accounts.length && ownStashes.length === validators.length && setQueried(
            ownStashes.reduce((queried: Queried, [stashId, isOwnStash], index): Queried => ({
              ...queried,
              [stashId]: [isOwnStash, accounts[index], validators[index]]
            }), {})
          );
        }).then((_unsub): void => {
          unsub = _unsub;
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
