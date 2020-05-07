// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { Option } from '@polkadot/types';

import useAccounts from './useAccounts';
import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';

type IsInKeyring = boolean;

function getStashes (allAccounts: string[], ownBonded: Option<AccountId>[], ownLedger: Option<StakingLedger>[]): [string, IsInKeyring][] {
  const result: [string, IsInKeyring][] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]) => accountId === stashId) && result.push([stashId, false]);
    }
  });

  return result;
}

export default function useOwnStashes (): [string, IsInKeyring][] | undefined {
  const { allAccounts, hasAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const { api } = useApi();
  const ownBonded = useCall<Option<AccountId>[]>(hasAccounts && api.query.staking?.bonded.multi, [allAccounts]);
  const ownLedger = useCall<Option<StakingLedger>[]>(hasAccounts && api.query.staking?.ledger.multi, [allAccounts]);
  const [state, setState] = useState<[string, IsInKeyring][] | undefined>();

  useEffect((): void => {
    mountedRef.current && ownBonded && ownLedger && setState(
      getStashes(allAccounts, ownBonded, ownLedger)
    );
  }, [allAccounts, mountedRef, ownBonded, ownLedger]);

  return state;
}

export function useOwnStashIds (): string[] | undefined {
  const mountedRef = useIsMountedRef();
  const ownStashes = useOwnStashes();
  const [stashIds, setStashIds] = useState<string[] | undefined>();

  useEffect((): void => {
    mountedRef.current && ownStashes && setStashIds(
      ownStashes.map(([stashId]) => stashId)
    );
  }, [mountedRef, ownStashes]);

  return stashIds;
}
