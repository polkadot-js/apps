// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u128, Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapEntries, useMapKeys } from '@polkadot/react-hooks';

const keyOptions = {
  transform: (keys: StorageKey<u128[]>[]): u128[] => keys.map(({args: [_collection, _token, attrKey]}) => attrKey)
};

const filter = (records: EventRecord[]): Changes<u128> => {
  const added: u128[] = [];
  const removed: u128[] = [];

  console.log({records})

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

const useAttributeKeysImpl = (collectionId: BN, tokenId?: BN): u128[] => {
  const { api } = useApi();

  let params = [collectionId, tokenId || null];
  const startValue = useMapKeys(api.query.multiTokens.attributes, keyOptions, params);
  
  return startValue || [];
  return useEventChanges([api.events.multiTokens.TokenCreated, api.events.multiTokens.TokenDestroyed], filter, startValue);
};

export default createNamedHook('useAttributeKeys', useAttributeKeysImpl);
