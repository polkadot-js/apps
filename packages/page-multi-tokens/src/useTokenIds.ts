// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u128, Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapEntries } from '@polkadot/react-hooks';

const keyOptions = {
  transform: (keys: [StorageKey<u128[]>, Option<any>][]): u128[] => keys.map(([storageKey]) => storageKey.args[1]).sort((a, b) => a.cmp(b))
};

const filter = (records: EventRecord[]): Changes<u128> => {
  const added: u128[] = [];
  const removed: u128[] = [];

  records.forEach(
    ({
      event: {
        data: [id],
        method
      }
    }): void => {
      if (method === 'TokenCreated') {
        added.push(id as u128);
      } else {
        removed.push(id as u128);
      }
    }
  );

  return { added, removed };
};

const useTokenIdsImpl = (collectionId: BN): u128[] => {
  const { api } = useApi();

  const startValue = useMapEntries(api.query.multiTokens.tokens, keyOptions, [collectionId]);

  return useEventChanges([api.events.multiTokens.TokenCreated, api.events.multiTokens.TokenDestroyed], filter, startValue);
};

export default createNamedHook('useTokenIds', useTokenIdsImpl);
