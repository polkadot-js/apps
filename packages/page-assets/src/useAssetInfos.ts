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
  const metadata = useCall<AssetMetadata[]>(api.query.assets.metadata.multi, [ids]);
  const details = useCall<Option<AssetDetails>[]>(api.query.assets.asset.multi, [ids]);
  const [state, setState] = useState<AssetInfo[] | undefined>();

  useEffect((): void => {
    details && metadata && ids && (details.length === ids.length) && (metadata.length === ids.length) &&
      setState(
        ids.map((id, index) =>
          extractInfo(allAccounts, id, details[index], metadata[index])
        )
      );
  }, [allAccounts, details, ids, metadata]);

  return state;
}
