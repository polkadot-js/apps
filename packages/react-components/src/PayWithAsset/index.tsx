// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';
import type { AssetInfoComplete } from '@polkadot/react-hooks/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getGenesis } from '@polkadot/apps-config';
import { Dropdown } from '@polkadot/react-components';
import { useApi, useAssetIds, useAssetInfos } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

const ALLOWED_CHAINS = [getGenesis('statemint')];

const PayWithAsset = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const ids = useAssetIds();
  const assetInfos = useAssetInfos(ids);
  const [infoIndex, setInfoIndex] = useState('0');

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

  const onSearch = useCallback(
    (options: DropdownItemProps[], value: string): DropdownItemProps[] =>
      options.filter((options) => {
        const { text: optText, value: optValue } = options as { text: string, value: number };

        return parseInt(value) === optValue || optText.includes(value);
      }),
    []
  );

  useEffect((): void => {
    const info = assetOptions.find(({ value }) => value === infoIndex);

    // if no info found (usually happens on first load), select the first one automatically
    if (!info) {
      setInfoIndex(assetOptions.at(0)?.value ?? nativeAsset);
    }
  }, [assetOptions, infoIndex, nativeAsset]);

  return (
    <Dropdown
      isDisabled={!ALLOWED_CHAINS.includes(api.genesisHash.toHex()) || completeInfos.length === 0}
      label={t('asset to pay the fee')}
      onChange={setInfoIndex}
      onSearch={onSearch}
      options={assetOptions}
      value={infoIndex}
    />
  );
};

export default React.memo(PayWithAsset);
