// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletUniquesItemMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AccountItem } from '../types.js';
import type { ItemInfo, ItemSupportedMetadata } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall, useMetadataFetch } from '@polkadot/react-hooks';
import { normalizeMetadataLink } from '@polkadot/react-hooks/useMetadataFetch';

type FetchedMetadata = Map<string, ItemSupportedMetadata | null>;

const QUERY_OPTS = { withParams: true };

const METADATA_FETCH_OPTIONS = {
  transform: (data: string | undefined): ItemSupportedMetadata | null => {
    if (!data) {
      return null;
    }

    try {
      const result = JSON.parse(data) as Record<string, any>;

      if (result && typeof result === 'object') {
        return {
          image: typeof result.image === 'string' ? normalizeMetadataLink(result.image) : null,
          name: typeof result.name === 'string' ? result.name : null
        };
      }
    } catch {}

    return null;
  }
};

function extractInfo ([, itemId]: [BN, BN], metadata: Option<PalletUniquesItemMetadata>, accountItems: AccountItem[]): ItemInfo {
  const item = accountItems.find(({ itemId: _itemId }) => _itemId.eq(itemId));

  if (!item) {
    throw new Error('Unable to extract accountId');
  }

  return {
    account: item.accountId,
    id: itemId,
    ipfsData: null,
    key: itemId.toString(),
    metadata: metadata.unwrapOr(null)
  };
}

const addFetchedMetadata = (fetchedMetadata: FetchedMetadata) => (itemInfo: ItemInfo): ItemInfo => {
  const metadataLink = normalizeMetadataLink(itemInfo.metadata?.data.toPrimitive() as string);

  return {
    ...itemInfo,
    ipfsData: (metadataLink && fetchedMetadata.has(metadataLink) && fetchedMetadata.get(metadataLink)) || null
  };
};

function useItemsInfosImpl (accountItems: AccountItem[]): ItemInfo[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<ItemInfo[] | undefined>();

  const ids = useMemo(
    () => accountItems.map(({ collectionId, itemId }) => [collectionId, itemId]),
    [accountItems]
  );

  const metadata = useCall<[[[BN, BN][]], Option<PalletUniquesItemMetadata>[]]>(api.query.uniques.instanceMetadataOf.multi, [ids], QUERY_OPTS);

  const metadataLinks = useMemo((): string[] | undefined => {
    if (metadata?.[1].length) {
      return metadata[1].map((o) =>
        o.isSome
          ? o.unwrap().data.toPrimitive() as string
          : ''
      );
    }

    return undefined;
  }, [metadata]);

  const fetchedMetadata = useMetadataFetch<ItemSupportedMetadata | null>(metadataLinks, METADATA_FETCH_OPTIONS);

  useEffect((): void => {
    if (fetchedMetadata && accountItems.length && metadata?.[0][0].length) {
      const [collectionId] = metadata[0][0][0];

      if (!collectionId.eq(ids[0][0])) {
        return;
      }

      const itemsInfos = metadata[0][0].map((id, index) => extractInfo(id, metadata[1][index], accountItems));

      setState(itemsInfos.map(addFetchedMetadata(fetchedMetadata)));
    }
  }, [accountItems, ids, fetchedMetadata, metadata]);

  return state;
}

export default createNamedHook('useItemsInfos', useItemsInfosImpl);
