// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { useApi, usePayWithAsset } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useTranslation } from './translate.js';

const PayWithAsset = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selectedAssetValue, setSelectedAssetValue] = useState('0');

  const { assetOptions, isDisabled, onChange } = usePayWithAsset();

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

  return (
    <Dropdown
      isDisabled={isDisabled}
      label={t('asset to pay the fee')}
      onChange={onSelect}
      onSearch={onSearch}
      options={assetOptions}
      value={selectedAssetValue}
    />
  );
};

export default React.memo(PayWithAsset);
