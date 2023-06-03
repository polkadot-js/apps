// Copyright 2017-2023 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AssetInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

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

function extractInfo (allAccounts: string[], id: BN, optDetails: Option<PalletAssetsAssetDetails>, metadata: PalletAssetsAssetMetadata): AssetInfo {
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
    key: id.toString(),
    metadata: metadata.isEmpty
      ? null
      : metadata
  };
}

function useAssetInfosImpl (ids?: BN[]): AssetInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const metadata: [[BN[]], PalletAssetsAssetMetadata[]] | undefined = useCall(api.query.assets.metadata.multi, [ids], QUERY_OPTS);
  const details: [[BN[]], Option<PalletAssetsAssetDetails>[]] | undefined = useCall(api.query.assets.asset.multi, [ids], QUERY_OPTS);
  const [state, setState] = useState<AssetInfo[] | undefined>();

  useEffect((): void => {
    details && metadata && (details[0][0].length === metadata[0][0].length) &&
      setState(
        details[0][0].map((id, index) =>
          extractInfo(allAccounts, id, details[1][index], metadata[1][index])
        )
      );
  }, [allAccounts, details, ids, metadata]);

  return state;
}

export default createNamedHook('useAssetInfos', useAssetInfosImpl);
