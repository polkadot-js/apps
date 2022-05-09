// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u128 } from '@polkadot/types';
import type { BN } from '@polkadot/util';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const keyOptions = {
  transform: (keys: StorageKey<u128[]>[]): u128[] => keys.map(({ args: [_collection, _token, attrKey] }) => attrKey)
};

const useAttributeKeysImpl = (collectionId: BN, tokenId?: BN): u128[] => {
  const { api } = useApi();

  let params = [collectionId, tokenId || null];
  const startValue = useMapKeys(api.query.multiTokens.attributes, keyOptions, params);

  return startValue || [];
};

export default createNamedHook('useAttributeKeys', useAttributeKeysImpl);
