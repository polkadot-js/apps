// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import type { Voters } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useEventTrigger } from '@polkadot/react-hooks';

const EMPTY: Voters = { candidates: [], skeptics: [], voters: [] };

async function getVoters (api: ApiPromise, candidates: DeriveSocietyCandidate[]): Promise<Voters> {
  const entries = await Promise.all(
    candidates.map(({ accountId }) => api.query.society.votes.entries(accountId))
  );
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
  const [state, setState] = useState<Voters>({});

  useEffect((): void => {
    voteTrigger && candidates && (
      candidates.length
        ? getVoters(api, candidates).then(setState).catch(console.error)
        : setState(EMPTY)
    );
  }, [api, candidates, voteTrigger]);

  return state;
}
