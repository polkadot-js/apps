// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CollectionInfo } from './types';

import isIPFS from 'is-ipfs';
import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { CollectionSupportedIpfsData } from './types';

interface FetchedIpfsData {
  data: CollectionSupportedIpfsData | null;
  id: BN;
}

const EMPTY_FLAGS = {
  isAdminMe: false,
  isFreezerMe: false,
  isIssuerMe: false,
  isOwnerMe: false
};

const QUERY_OPTS = { withParams: true };

function isAccount (allAccounts: string[], accountId: AccountId): boolean {
  const address = accountId.toString();

  return allAccounts.some((a) => a === address);
}

function extractInfo (allAccounts: string[], id: BN, optDetails: Option<PalletUniquesClassDetails>, metadata: PalletUniquesClassMetadata): CollectionInfo {
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
    metadata: metadata.isEmpty
      ? null
      : metadata
  };
}

function isCid (cid: string): boolean {
  return isIPFS.cid(cid) || isIPFS.base32cid(cid.toLowerCase());
}

function formatIpfsData (data: {[key: string]: any}): CollectionSupportedIpfsData | null {
  if (data && typeof data === 'object') {
    return {
      image: typeof data.image === 'string' ? data.image.replace(/ipfs:\/\/|ipfs\//gi, '') : null,
      name: typeof data.name === 'string' ? data.name : null
    };
  }

  return null;
}

async function fetchIpfsData (state: CollectionInfo[]): Promise<FetchedIpfsData[]> {
  const promises = state.map((item) => {
    const ipfsHash = item.metadata?.toHuman()?.data;

    if (!ipfsHash || !isCid(ipfsHash.toString())) {
      return {
        data: null,
        id: item.id
      };
    }

    return fetch(`https://ipfs.io/ipfs/${ipfsHash.toString()}`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }

        return null;
      })
      .then((data) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        data: formatIpfsData(data),
        id: item.id
      }));
  });

  return Promise.all(promises); // TODO: use allSettled instead
}

const addIpfsData = (ipfsData: FetchedIpfsData[]) => (collectionInfo: CollectionInfo): CollectionInfo => {
  const collectionIpfsData = ipfsData.find((item) => item.id.eq(collectionInfo.id));

  return {
    ...collectionInfo,
    ipfsData: collectionIpfsData?.data || null
  };
};

function useCollectionInfosImpl (ids?: BN[]): CollectionInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const metadata = useCall<[[BN[]], PalletUniquesClassMetadata[]]>(api.query.uniques.classMetadataOf.multi, [ids], QUERY_OPTS);
  const details = useCall<[[BN[]], Option<PalletUniquesClassDetails>[]]>(api.query.uniques.class.multi, [ids], QUERY_OPTS);
  const [state, setState] = useState<CollectionInfo[] | undefined>();

  useEffect((): void => {
    if (details && metadata && (details[0][0].length === metadata[0][0].length)) {
      const collectionInfos = details[0][0].map((id, index) =>
        extractInfo(allAccounts, id, details[1][index], metadata[1][index])
      );

      fetchIpfsData(collectionInfos)
        .then((ipfsData) => setState(collectionInfos.map(addIpfsData(ipfsData))))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => { });
    }
  }, [allAccounts, details, ids, metadata]);

  return state;
}

export default createNamedHook('useCollectionInfos', useCollectionInfosImpl);
