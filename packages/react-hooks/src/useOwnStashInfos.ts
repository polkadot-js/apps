// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AccountId, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';
import { StakerState } from './types';

import { useEffect, useState } from 'react';
import { u8aConcat, u8aToHex } from '@polkadot/util';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useIsMountedRef from './useIsMountedRef';
import useOwnStashes from './useOwnStashes';
import useStashIds from './useStashIds';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;
type Queried = Record<string, [boolean, DeriveStakingAccount, ValidatorInfo]>;

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

function getStakerState (stashId: string, allAccounts: string[], allStashes: string[] | undefined, [isOwnStash, { controllerId: _controllerId, exposure, nextSessionIds, nominators, rewardDestination, sessionIds, stakingLedger, validatorPrefs }, validateInfo]: [boolean, DeriveStakingAccount, ValidatorInfo]): StakerState {
  const isStashNominating = !!(nominators?.length);
  const isStashValidating = !(Array.isArray(validateInfo) ? validateInfo[1].isEmpty : validateInfo.isEmpty) || !!allStashes?.includes(stashId);
  const nextConcat = u8aConcat(...nextSessionIds.map((id): Uint8Array => id.toU8a()));
  const currConcat = u8aConcat(...sessionIds.map((id): Uint8Array => id.toU8a()));
  const controllerId = toIdString(_controllerId);

  return {
    controllerId,
    destination: rewardDestination?.toString().toLowerCase(),
    destinationId: rewardDestination?.toNumber() || 0,
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

export default function useOwnStashInfos (): StakerState[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const ownStashes = useOwnStashes();
  const allStashes = useStashIds();
  const [queried, setQueried] = useState<Queried | undefined>();
  const [state, setState] = useState<StakerState[] | undefined>();

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

  useEffect((): void => {
    allAccounts && allStashes && ownStashes && queried && ownStashes.length === Object.keys(queried).length && setState(
      ownStashes
        .filter(([stashId]) => queried[stashId])
        .map(([stashId]) => getStakerState(stashId, allAccounts, allStashes, queried[stashId]))
    );
  }, [allAccounts, allStashes, ownStashes, queried]);

  return state;
}
