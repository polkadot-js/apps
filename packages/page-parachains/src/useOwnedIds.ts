// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { Hash, ParaId } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeCommonParasRegistrarParaInfo } from '@polkadot/types/lookup';
import type { OwnedId, OwnedIdPartial } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useEventTrigger, useMapEntries } from '@polkadot/react-hooks';

interface CodeHash {
  hash: Hash | null;
  paraId: ParaId;
}

interface Owned {
  ids: ParaId[];
  owned: OwnedIdPartial[];
}

const OPT_ENTRIES = {
  transform: (entries: [StorageKey<[ParaId]>, Option<PolkadotRuntimeCommonParasRegistrarParaInfo>][]): Owned => {
    const owned = entries
      .map(([{ args: [paraId] }, optInfo]): OwnedIdPartial | null => {
        if (optInfo.isNone) {
          return null;
        }

        const paraInfo = optInfo.unwrap();

        return {
          manager: paraInfo.manager.toString(),
          paraId,
          paraInfo
        };
      })
      .filter((id): id is OwnedIdPartial => !!id);

    return {
      ids: owned.map(({ paraId }) => paraId),
      owned
    };
  }
};

const OPT_HASHES = {
  transform: ([[paraIds], optHashes]: [[ParaId[]], Option<Hash>[]]) =>
    paraIds.map((paraId, index): CodeHash => ({
      hash: optHashes[index].unwrapOr(null),
      paraId
    })),
  withParamsTransform: true
};

function useOwnedIdsImpl (): OwnedId[] {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const trigger = useEventTrigger([
    api.events.registrar.Registered,
    api.events.registrar.Reserved
  ]);
  const unfiltered = useMapEntries<Owned>(api.query.registrar.paras, [], OPT_ENTRIES, trigger.blockHash);
  const hashes = useCall(api.query.paras.currentCodeHash.multi, [unfiltered ? unfiltered.ids : []], OPT_HASHES);

  return useMemo(
    () => unfiltered && hashes
      ? unfiltered.owned
        .filter((id) => allAccounts.some((a) => a === id.manager))
        .map((data): OwnedId => ({
          ...data,
          hasCode: hashes.some((h) => !!h.hash && h.paraId.eq(data.paraId))
        }))
      : [],
    [allAccounts, hashes, unfiltered]
  );
}

export default createNamedHook('useOwnedIds', useOwnedIdsImpl);
