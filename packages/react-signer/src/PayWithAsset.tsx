// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';
import type { ExtendedSignerOptions } from './types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, Modal } from '@polkadot/react-components';
import { useApi, usePayWithAsset } from '@polkadot/react-hooks';
import { getFeeAssetLocation } from '@polkadot/react-hooks/utils/getFeeAssetLocation';
import { BN } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  onChangeFeeAsset: React.Dispatch<React.SetStateAction<ExtendedSignerOptions>>
}

const PayWithAsset = ({ onChangeFeeAsset }: Props) => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selectedAssetValue, setSelectedAssetValue] = useState('-1');

  const { assetOptions, isDisabled, onChange, selectedFeeAsset } = usePayWithAsset();

  const nativeAsset = useMemo(
    () => api.registry.chainTokens[0],
    [api]
  );

  const onSearch = useCallback(
    (options: DropdownItemProps[], value: string): DropdownItemProps[] =>
      options.filter((options) => {
        const { text: optText, value: optValue } = options as { text: string, value: number };

        return parseInt(value) === optValue || optText.includes(value);
      }),
    []
  );

  const onSelect = useCallback((value: string) => {
    onChange(value === nativeAsset ? new BN(-1) : new BN(value), () => setSelectedAssetValue(value));
  }, [nativeAsset, onChange]);

  useEffect((): void => {
    const info = assetOptions.find(({ value }) => value === selectedAssetValue);

    // if no info found (usually happens on first load), select the first one automatically
    if (!info) {
      setSelectedAssetValue(assetOptions.at(0)?.value ?? nativeAsset);
    }
  }, [assetOptions, selectedAssetValue, nativeAsset]);

  useEffect(() => {
    onChangeFeeAsset((e) =>
      ({
        ...e,
        assetId: getFeeAssetLocation(api, selectedFeeAsset),
        feeAsset: selectedFeeAsset
      })
    );
  }, [api, onChangeFeeAsset, selectedFeeAsset]);

  useEffect(() => {
    // Reselect native asset on component unmount
    return () => onSelect(nativeAsset);
  }, [nativeAsset, onSelect]);

  return (
    <Modal.Columns hint={t('By selecting this option, the transaction fee will be automatically deducted from the specified asset, ensuring a seamless and efficient payment process.')}>
      <Dropdown
        isDisabled={isDisabled}
        label={t('asset to pay the fee')}
        onChange={onSelect}
        onSearch={onSearch}
        options={assetOptions}
        value={selectedAssetValue}
      />
    </Modal.Columns>
  );
};

export default React.memo(PayWithAsset);
