// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletUniquesInstanceMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AccountItem } from '../types';
import type { ItemInfo, ItemSupportedIpfsData } from './types';

import isIPFS from 'is-ipfs';
import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface FetchedIpfsData {
  data: ItemSupportedIpfsData | null;
  id: BN;
}

const QUERY_OPTS = { withParams: true };
const cache = new Map<string, ItemSupportedIpfsData | null>();

function extractInfo ([, itemId]: [BN, BN], metadata: PalletUniquesInstanceMetadata, accountItems: AccountItem[]): ItemInfo {
  const { accountId } = accountItems.find(({ itemId: _itemId }) => _itemId.eq(itemId)) as AccountItem;

  return {
    account: accountId,
    id: itemId,
    ipfsData: null,
    key: itemId.toString(),
    metadata: metadata.isEmpty
      ? null
      : metadata
  };
}

function isCid (cid: string): boolean {
  return isIPFS.cid(cid) || isIPFS.base32cid(cid.toLowerCase());
}

function formatIpfsData (data: {[key: string]: any}): ItemSupportedIpfsData | null {
  if (data && typeof data === 'object') {
    return {
      image: typeof data.image === 'string' ? data.image.replace(/ipfs:\/\/|ipfs\//gi, '') : null,
      name: typeof data.name === 'string' ? data.name : null
    };
  }

  return null;
}

async function fetchIpfsData (items: ItemInfo[]): Promise<FetchedIpfsData[]> {
  const promises = items.map((item) => {
    const ipfsHash = item.metadata?.toHuman()?.data?.toString();

    if (!ipfsHash || !isCid(ipfsHash)) {
      return {
        data: null,
        id: item.id
      };
    }

    if (cache.has(ipfsHash)) {
      return {
        data: cache.get(ipfsHash),
        id: item.id
      } as FetchedIpfsData;
    }

    return fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }

        return null;
      })
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const ipfsData = formatIpfsData(data);

        cache.set(ipfsHash, ipfsData);

        return {
          data: ipfsData,
          id: item.id
        };
      });
  });

  return Promise.all(promises); // TODO: use allSettled instead
}

const addIpfsData = (ipfsData: FetchedIpfsData[]) => (itemInfo: ItemInfo): ItemInfo => {
  const itemIpfsData = ipfsData.find((item) => item.id.eq(itemInfo.id));

  return {
    ...itemInfo,
    ipfsData: itemIpfsData?.data || null
  };
};

function useItemsInfosImpl (accountItems: AccountItem[]): ItemInfo[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<ItemInfo[] | undefined>();

  const ids = useMemo(
    () => accountItems.map(({ collectionId, itemId }) => [collectionId, itemId]),
    [accountItems]
  );

  const metadata = useCall<[[[BN, BN][]], PalletUniquesInstanceMetadata[]]>(api.query.uniques.instanceMetadataOf.multi, [ids], QUERY_OPTS);

  useEffect((): void => {
    if (accountItems.length && metadata && metadata[0][0].length) {
      const [collectionId] = metadata[0][0][0];

      if (!collectionId.eq(ids[0][0])) return;

      const itemsInfos = metadata[0][0].map((id, index) => extractInfo(id, metadata[1][index], accountItems));

      fetchIpfsData(itemsInfos)
        .then((ipfsData) => setState(itemsInfos.map(addIpfsData(ipfsData))))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => { });
    }
  }, [accountItems, ids, metadata]);

  return state;
}

export default createNamedHook('useItemsInfos', useItemsInfosImpl);
