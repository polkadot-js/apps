// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { ParaId, ParaInfo } from '@polkadot/types/interfaces';
import type { OwnedId } from './types';

import { useMemo } from 'react';

import { useAccounts, useApi, useEventTrigger, useMapEntries } from '@polkadot/react-hooks';

function extractIds (entries: [StorageKey<[ParaId]>, Option<ParaInfo>][]): (OwnedId | null)[] {
  return entries.map(([{ args: [paraId] }, optInfo]): OwnedId | null => {
    if (optInfo.isNone) {
      return null;
    }

    const paraInfo = optInfo.unwrap();

    return {
      manager: paraInfo.manager.toString(),
      paraId,
      paraInfo
    };
  });
}

export default function useOwnedIds (): OwnedId[] {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const trigger = useEventTrigger([api.events.registrar.Registered]);
  const unfiltered = useMapEntries(api.query.registrar.paras, { at: trigger, transform: extractIds });

  return useMemo(
    () => (unfiltered || []).filter((id): id is OwnedId => !!id && allAccounts.some((a) => a === id.manager)),
    [allAccounts, unfiltered]
  );
}
