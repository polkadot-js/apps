// Copyright 2017-2023 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesCollectionDetails, PalletUniquesCollectionMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CollectionInfo, CollectionSupportedIpfsData } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useIpfsFetch } from '@polkadot/react-hooks';

type IpfsData = Map<string, CollectionSupportedIpfsData | null>;

const EMPTY_FLAGS = {
  isAdminMe: false,
  isFreezerMe: false,
  isIssuerMe: false,
  isOwnerMe: false
};

const QUERY_OPTS = { withParams: true };

const IPFS_FETCH_OPTIONS = {
  transform: (data: string | undefined): CollectionSupportedIpfsData | null => {
    if (!data) {
      return null;
    }

    try {
      const result = JSON.parse(data) as Record<string, any>;

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

function isAccount (allAccounts: string[], accountId: AccountId): boolean {
  const address = accountId.toString();

  return allAccounts.some((a) => a === address);
}

function extractInfo (allAccounts: string[], id: BN, optDetails: Option<PalletUniquesCollectionDetails>, metadata: Option<PalletUniquesCollectionMetadata>): CollectionInfo {
  const details = optDetails.unwrapOr(null);

  return {
    ...(details
      ? {
        isAdminMe: isAccount(allAccounts, details.admin),
        isFreezerMe: isAccount(allAccounts, details.freezer),
        isIssuerMe: isAccount(allAccounts, details.issuer),
        isOwnerMe: isAccount(allAccounts, details.owner)
      }
      : EMPTY_FLAGS
    ),
    details,
    id,
    ipfsData: null,
    key: id.toString(),
    metadata: metadata.unwrapOr(null)
  };
}

const addIpfsData = (ipfsData: IpfsData) => (collectionInfo: CollectionInfo): CollectionInfo => {
  const ipfsHash = collectionInfo.metadata && collectionInfo.metadata.data?.toPrimitive() as string;

  return {
    ...collectionInfo,
    ipfsData: (ipfsHash && ipfsData.has(ipfsHash) && ipfsData.get(ipfsHash)) || null
  };
};

function useCollectionInfosImpl (ids?: BN[]): CollectionInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const metadata = useCall<[[BN[]], Option<PalletUniquesCollectionMetadata>[]]>(api.query.uniques.classMetadataOf.multi, [ids], QUERY_OPTS);
  const details = useCall<[[BN[]], Option<PalletUniquesCollectionDetails>[]]>(api.query.uniques.class.multi, [ids], QUERY_OPTS);
  const [state, setState] = useState<CollectionInfo[] | undefined>();

  const ipfsHashes = useMemo(
    () => metadata?.[1].length
      ? metadata[1].map((o) =>
        o.isSome
          ? o.unwrap().data.toPrimitive() as string
          : ''
      )
      : [],
    [metadata]
  );

  const ipfsData = useIpfsFetch<CollectionSupportedIpfsData | null>(ipfsHashes, IPFS_FETCH_OPTIONS);

  useEffect((): void => {
    if (ipfsData && details && metadata && (details[0][0].length === metadata[0][0].length)) {
      const collectionInfos = details[0][0].map((id, index) =>
        extractInfo(allAccounts, id, details[1][index], metadata[1][index])
      );

      setState(collectionInfos.map(addIpfsData(ipfsData)));
    }
  }, [allAccounts, details, ids, ipfsData, metadata]);

  return state;
}

export default createNamedHook('useCollectionInfos', useCollectionInfosImpl);
