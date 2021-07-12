// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { Voters } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useEventTrigger } from '@polkadot/react-hooks';

const transformDefender = {
  transform: (opt: Option<AccountId>) => opt.unwrapOr(null)
};

async function getVoters (api: ApiPromise, defender: AccountId | null | undefined, candidates: DeriveSocietyCandidate[]): Promise<Voters> {
  const accountIds: AccountId[] = defender
    ? [defender]
    : [];

  candidates.forEach(({ accountId }): void => {
    accountIds.push(accountId);
  });

  const entries = accountIds.length
    ? await Promise.all(accountIds.map((a) => api.query.society.votes.entries(a)))
    : [];
  const skeptics: string[] = [];
  const voters: string[] = [];

  entries.forEach((list): void => {
    list.forEach(([{ args: [, accountId] }, opt]) => {
      if (opt.isSome) {
        const key = accountId.toString();
        const vote = opt.unwrap();

        if (vote.isSkeptic) {
          !skeptics.includes(key) && skeptics.push(key);
        } else {
          !voters.includes(key) && voters.push(key);
        }
      }
    });
  });

  return { candidates, skeptics, voters };
}

export default function useVoters (): Voters {
  const { api } = useApi();
  const voteTrigger = useEventTrigger([api.events.society.Vote]);
  const candidates = useCall<DeriveSocietyCandidate[]>(api.derive.society.candidates);
  const defender = useCall<AccountId | null>(api.query.society.defender, undefined, transformDefender);
  const [state, setState] = useState<Voters>({});

  useEffect((): void => {
    console.log('useEffect', voteTrigger, candidates);

    voteTrigger && candidates &&
      getVoters(api, defender, candidates).then(setState).catch(console.error);
  }, [api, candidates, defender, voteTrigger]);

  return state;
}
