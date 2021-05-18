// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey } from '@polkadot/types';
import type { Hash, ParaId, ParaInfo } from '@polkadot/types/interfaces';
import type { OwnedId, OwnedIdPartial } from './types';

import { useMemo } from 'react';

import { useApi, useCall, useEventTrigger, useMapEntries } from '@polkadot/react-hooks';

interface CodeHash {
  hash: Hash | null;
  paraId: ParaId;
}

interface Owned {
  ids: ParaId[];
  owned: OwnedIdPartial[];
}

function extractIds (entries: [StorageKey<[ParaId]>, Option<ParaInfo>][]): Owned {
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

const hashesOption = {
  transform: ([[paraIds], optHashes]: [[ParaId[]], Option<Hash>[]]) =>
    paraIds.map((paraId, index): CodeHash => ({
      hash: optHashes[index].unwrapOr(null),
      paraId
    })),
  withParamsTransform: true
};

export default function useAllIds (isActive: boolean, apiOverride?: ApiPromise | null): OwnedId[] {
  const { api, isApiReady } = useApi();
  const trigger = useEventTrigger([
    isApiReady && isActive && (apiOverride || api).events.registrar?.Registered,
    isApiReady && isActive && (apiOverride || api).events.registrar?.Reserved
  ], undefined, apiOverride);
  const unfiltered = useMapEntries<Owned>(
    isApiReady && isActive && (apiOverride || api).query.registrar?.paras,
    { at: trigger, transform: extractIds }
  );
  const paraIds = useCall<ParaId[]>(isApiReady && isActive && (apiOverride || api).query.paras?.parachains);
  const hashes = useCall(
    isApiReady && isActive && (apiOverride || api).query.paras?.currentCodeHash.multi,
    [unfiltered ? unfiltered.ids : []],
    hashesOption
  );

  return useMemo(
    () => isActive && unfiltered && hashes && paraIds
      ? unfiltered.owned.map((data): OwnedId => ({
        ...data,
        isChain: paraIds.some((paraId) => paraId.eq(data.paraId)),
        isThread: hashes.some(({ hash, paraId }) => !!hash && paraId.eq(data.paraId))
      }))
      : [],
    [hashes, isActive, paraIds, unfiltered]
  );
}
