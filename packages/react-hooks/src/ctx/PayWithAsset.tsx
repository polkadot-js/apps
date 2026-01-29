// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { AssetInfoComplete } from '../types.js';
import type { PayWithAsset } from './types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { useApi, useAssetIds, useAssetInfos } from '@polkadot/react-hooks';

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

  return isApiReady ? <PayWithAssetProvider>{children}</PayWithAssetProvider> : <>{children}</>;
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

  const completeAssetInfos = useMemo(
    () => (assetInfos
      ?.filter((i): i is AssetInfoComplete =>
        !!(i.details && i.metadata) && !i.details.supply.isZero() && !!i.details?.toJSON().isSufficient)
    ) || [],
    [assetInfos]
  );

  const assetOptions = useMemo(
    () => [
      { text: `${nativeAsset} (Native)`, value: nativeAsset },
      ...completeAssetInfos.map(({ id, metadata }) => ({
        text: `${metadata.name.toUtf8()} (${id.toString()})`,
        value: id.toString()
      }))],
    [completeAssetInfos, nativeAsset]
  );

  const onChange = useCallback((assetId: BN, cb?: () => void) => {
    const selectedFeeAsset = completeAssetInfos.find((a) => a.id.toString() === assetId.toString());

    setSelectedFeeAsset(selectedFeeAsset ?? null);
    cb?.();
  }, [completeAssetInfos]);

  const isEnabled = useMemo(() =>
    api.registry.signedExtensions.some(
      (a) => a === 'ChargeAssetTxPayment'
    ) &&
    !!api.tx.assetConversion &&
    !!api.call.assetConversionApi &&
    completeAssetInfos.length > 0,
  [api.call.assetConversionApi, api.registry.signedExtensions, api.tx.assetConversion, completeAssetInfos.length]
  );

  const values: PayWithAsset = useMemo(() => {
    return {
      assetOptions,
      isDisabled: !isEnabled,
      onChange,
      selectedFeeAsset
    };
  }, [assetOptions, isEnabled, onChange, selectedFeeAsset]);

  return (
    <PayWithAssetCtx.Provider value={values}>
      {children}
    </PayWithAssetCtx.Provider>
  );
}
