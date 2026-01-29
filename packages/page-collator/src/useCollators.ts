// Copyright 2017-2025 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BTreeSet } from '@polkadot/types';
import type { AccountId32, Balance } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { Collator } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Authored = Record<string, BN>;

interface PalletCollatorSelectionCandidateInfo {
  deposit: Balance;
  who: AccountId32;
}

const OPT_INV = {
  transform: (invulnerables: AccountId32[]) =>
    invulnerables.map((accountId32): Collator => ({
      accountId: accountId32.toString(),
      isInvulnerable: true
    }))
};

const OPT_CAN = {
  transform: (candidates: PalletCollatorSelectionCandidateInfo[] | BTreeSet) =>
    Array.isArray(candidates)
      ? candidates.map(({ deposit, who }): Collator => ({
        accountId: who.toString(),
        deposit,
        isInvulnerable: false
      }))
      : candidates.strings.map((accountId): Collator => ({
        accountId,
        isInvulnerable: false
      }))
};

const OPT_AUT = {
  transform: ([[accountIds], lastAuthoredBlocks]: [[string[]], BN[]]) =>
    accountIds.reduce<Authored>((map, accountId, index): Authored => ({
      ...map,
      [accountId]: lastAuthoredBlocks[index]
    }), {}),
  withParamsTransform: true
};

function includeAuthors (prev: Collator[], authored: Authored): Collator[] {
  let hasDiff = false;
  const adjusted = prev.map((c): Collator => {
    if (authored[c.accountId] && (!c.lastBlock || !authored[c.accountId].eq(c.lastBlock))) {
      hasDiff = true;

      return { ...c, lastBlock: authored[c.accountId] };
    }

    return c;
  });

  return hasDiff
    ? adjusted
    : prev;
}

function useCollatorImpl (): Collator[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<Collator[] | undefined>();

  const accountIds = useMemo(
    () => state?.map(({ accountId }) => accountId),
    [state]
  );

  // candidates was replaced by candidateList. This is for compatibility.
  const candidateCall = api.query.collatorSelection.candidates || api.query.collatorSelection.candidateList;
  const invulnerables = useCall<Collator[]>(api.query.collatorSelection.invulnerables, [], OPT_INV);
  const candidates = useCall<Collator[]>(candidateCall, [], OPT_CAN);
  const lastBlocks = useCall<Authored>(accountIds && api.query.collatorSelection.lastAuthoredBlock?.multi, [accountIds], OPT_AUT);

  useEffect(
    () => invulnerables && candidates && setState(() =>
      [...invulnerables, ...candidates]
    ),
    [candidates, invulnerables]
  );

  useEffect(
    () => lastBlocks && setState((prev) =>
      prev && includeAuthors(prev, lastBlocks)
    ),
    [lastBlocks]
  );

  return state;
}

export default createNamedHook('useCollatorImpl', useCollatorImpl);
