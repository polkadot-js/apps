// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { AssetInfoComplete } from '../types.js';
import type { PayWithAsset } from './types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { useApi, useAssetIds, useAssetInfos } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { CHAINS_WITH_FEE_ASSET } from '../constants.js';

interface Props {
  children?: React.ReactNode;
}

const EMPTY_STATE: PayWithAsset = {
  assetOptions: [],
  isDisabled: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {},
  selectedFeeAsset: null
};

export const PayWithAssetCtx = React.createContext<PayWithAsset>(EMPTY_STATE);

export function PayWithAssetCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { isApiReady } = useApi();

  if (!isApiReady) {
    return <>{children}</>;
  }

  return <PayWithAssetProvider>{children}</PayWithAssetProvider>;
}

function PayWithAssetProvider ({ children }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const ids = useAssetIds();
  const assetInfos = useAssetInfos(ids);
  const [selectedFeeAsset, setSelectedFeeAsset] = useState<AssetInfoComplete | null>(null);

  const nativeAsset = useMemo(
    () => api.registry.chainTokens[0],
    [api]
  );

  const completeInfos = useMemo(
    () => (assetInfos
      ?.filter((i): i is AssetInfoComplete =>
        !!(i.details && i.metadata) && !i.details.supply.isZero() && !!i.details?.toJSON().isSufficient)
      .sort((a, b) => a.id.cmp(b.id))) || [],
    [assetInfos]
  );

  const assetOptions = useMemo(
    () => [
      { text: `${nativeAsset} (Native)`, value: nativeAsset },
      ...completeInfos.map(({ id, metadata }) => ({
        text: `${metadata.name.toUtf8()} (${formatNumber(id)})`,
        value: id.toString()
      }))],
    [completeInfos, nativeAsset]
  );

  const onChange = useCallback((assetId: BN, cb?: () => void) => {
    const selectedFeeAsset = completeInfos.find((a) => a.id.toString() === assetId.toString());

    setSelectedFeeAsset(selectedFeeAsset ?? null);
    cb?.();
  }, [completeInfos]);

  const isDisabled = useMemo(() => !CHAINS_WITH_FEE_ASSET.includes(api.genesisHash.toHex()) || completeInfos.length === 0, [api.genesisHash, completeInfos.length]);

  const values: PayWithAsset = useMemo(() => {
    return {
      assetOptions,
      isDisabled,
      onChange,
      selectedFeeAsset
    };
  }, [assetOptions, isDisabled, onChange, selectedFeeAsset]);

  return (
    <PayWithAssetCtx.Provider value={values}>
      {children}
    </PayWithAssetCtx.Provider>
  );
}
