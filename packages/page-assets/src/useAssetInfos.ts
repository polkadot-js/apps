// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, AssetDetails, AssetId, AssetMetadata } from '@polkadot/types/interfaces';
import type { AssetInfo } from './types';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

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

function extractInfo (allAccounts: string[], id: AssetId, optDetails: Option<AssetDetails>, metadata: AssetMetadata): AssetInfo {
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

export default function useAssetInfos (ids?: AssetId[]): AssetInfo[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const metadata = useCall<[[AssetId[]], AssetMetadata[]]>(api.query.assets.metadata.multi, [ids], QUERY_OPTS);
  const details = useCall<[[AssetId[]], Option<AssetDetails>[]]>(api.query.assets.asset.multi, [ids], QUERY_OPTS);
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
