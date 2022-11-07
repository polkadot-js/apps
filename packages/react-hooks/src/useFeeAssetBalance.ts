// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FeeAsset } from '@polkadot/apps-config/settings/types';
import type { Option } from '@polkadot/types';
import type { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useEffect, useState } from 'react';

import { feeAssets } from '@polkadot/apps-config';
import { useApi, useCall } from '@polkadot/react-hooks';

export const useFeeAssetBalance = (accountId: string | null): [
  FeeAsset,
  BN | null
] => {
  const { api } = useApi();
  const [feeBalance, setFeeBalance] = useState<BN | null>(null);
  const feeAsset = feeAssets[api.runtimeVersion.specName.toString()];
  const assetsAccount = useCall<Option<PalletAssetsAssetAccount>>(api.query.assets?.account, [feeAsset?.assetId, accountId]);

  useEffect(() => {
    if (!assetsAccount) {
      return;
    }

    if (assetsAccount.isSome) {
      const { balance } = assetsAccount.unwrap();

      setFeeBalance(balance);
    }

    if (assetsAccount.isNone) {
      setFeeBalance(api.registry.createType('Balance', 0));
    }
  }, [api, assetsAccount]);

  return [feeAsset, feeBalance];
};
