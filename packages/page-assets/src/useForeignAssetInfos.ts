// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata, StagingXcmV3MultiLocation } from '@polkadot/types/lookup';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const EMPTY_FLAGS = {
  isAdminMe: false,
  isFreezerMe: false,
  isIssuerMe: false,
  isOwnerMe: false
};

export interface ForeignAssetInfo {
  details: PalletAssetsAssetDetails | null;
  location: StagingXcmV3MultiLocation;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletAssetsAssetMetadata | null;
}

const QUERY_OPTS = { withParams: true };

function isAccount (allAccounts: string[], accountId: AccountId): boolean {
  const address = accountId.toString();

  return allAccounts.some((a) => a === address);
}

function extractInfo (allAccounts: string[], location: StagingXcmV3MultiLocation, optDetails: Option<PalletAssetsAssetDetails>, metadata: PalletAssetsAssetMetadata): ForeignAssetInfo {
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
    key: String(location),
    location,
    metadata: metadata.isEmpty
      ? null
      : metadata
  };
}

function useForeignAssetInfosImpl (locations?: StagingXcmV3MultiLocation[]): ForeignAssetInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  const isReady = useMemo(() => !!locations?.length && !!api.tx.foreignAssets?.setMetadata && !!api.tx.foreignAssets?.transferKeepAlive, [api.tx.foreignAssets?.setMetadata, api.tx.foreignAssets?.transferKeepAlive, locations?.length]);

  const metadata = useCall<[[StagingXcmV3MultiLocation[]], PalletAssetsAssetMetadata[]]>(isReady && api.query.foreignAssets.metadata.multi, [locations], QUERY_OPTS);
  const details = useCall<[[StagingXcmV3MultiLocation[]], Option<PalletAssetsAssetDetails>[]]>(isReady && api.query.foreignAssets.asset.multi, [locations], QUERY_OPTS);
  const [state, setState] = useState<ForeignAssetInfo[] | undefined>();

  useEffect((): void => {
    details && metadata && (details[0][0].length === metadata[0][0].length) &&
      setState(
        details[0][0].map((location, index) =>
          extractInfo(allAccounts, location, details[1][index], metadata[1][index])
        )
      );
  }, [allAccounts, details, locations, metadata]);

  return state;
}

export const useForeignAssetInfos = createNamedHook('useForeignAssetInfos', useForeignAssetInfosImpl);
