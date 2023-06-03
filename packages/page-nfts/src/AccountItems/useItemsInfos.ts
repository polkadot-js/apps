// Copyright 2017-2023 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletUniquesItemMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AccountItem } from '../types.js';
import type { ItemInfo, ItemSupportedIpfsData } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall, useIpfsFetch } from '@polkadot/react-hooks';

type IpfsData = Map<string, ItemSupportedIpfsData | null>;

const QUERY_OPTS = { withParams: true };

const IPFS_FETCH_OPTIONS = {
  transform: (data: string | undefined): ItemSupportedIpfsData | null => {
    if (!data) {
      return null;
    }

    try {
      const result = JSON.parse(data) as {[key: string]: any};

      if (result && typeof result === 'object') {
        return {
          image: typeof result.image === 'string' ? result.image.replace(/ipfs:\/\/|ipfs\//gi, '') : null,
          name: typeof result.name === 'string' ? result.name : null
        };
      }
    } catch {}

    return null;
  }
};

function extractInfo ([, itemId]: [BN, BN], metadata: Option<PalletUniquesItemMetadata>, accountItems: AccountItem[]): ItemInfo {
  const { accountId } = accountItems.find(({ itemId: _itemId }) => _itemId.eq(itemId)) as AccountItem;

  return {
    account: accountId,
    id: itemId,
    ipfsData: null,
    key: itemId.toString(),
    metadata: metadata.unwrapOr(null)
  };
}

const addIpfsData = (ipfsData: IpfsData) => (itemInfo: ItemInfo): ItemInfo => {
  const ipfsHash = itemInfo.metadata && itemInfo.metadata.data.toString();

  return {
    ...itemInfo,
    ipfsData: (ipfsHash && ipfsData.has(ipfsHash) && ipfsData.get(ipfsHash)) || null
  };
};

function useItemsInfosImpl (accountItems: AccountItem[]): ItemInfo[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<ItemInfo[] | undefined>();

  const ids = useMemo(
    () => accountItems.map(({ collectionId, itemId }) => [collectionId, itemId]),
    [accountItems]
  );

  const metadata: [[[BN, BN][]], Option<PalletUniquesItemMetadata>[]] | undefined = useCall(api.query.uniques.instanceMetadataOf.multi, [ids], QUERY_OPTS);

  const ipfsHashes = useMemo((): string[] | undefined => {
    if (metadata && metadata[1].length) {
      return metadata[1].map((o) =>
        o.isSome
          ? o.unwrap().data.toString()
          : ''
      );
    }

    return undefined;
  }, [metadata]);

  const ipfsData = useIpfsFetch<ItemSupportedIpfsData | null>(ipfsHashes, IPFS_FETCH_OPTIONS);

  useEffect((): void => {
    if (ipfsData && accountItems.length && metadata && metadata[0][0].length) {
      const [collectionId] = metadata[0][0][0];

      if (!collectionId.eq(ids[0][0])) {
        return;
      }

      const itemsInfos = metadata[0][0].map((id, index) => extractInfo(id, metadata[1][index], accountItems));

      setState(itemsInfos.map(addIpfsData(ipfsData)));
    }
  }, [accountItems, ids, ipfsData, metadata]);

  return state;
}

export default createNamedHook('useItemsInfos', useItemsInfosImpl);
