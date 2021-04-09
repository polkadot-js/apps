// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Asset from './Asset';
import useAssetInfos from './useAssetInfos';

interface Props {
  assetIds?: AssetId[];
  className?: string;
}

function Assets ({ assetIds, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const assetInfos = useAssetInfos(assetIds);

  const headerRef = useRef([
    [t('assets'), 'start', 2],
    [t('owner'), 'address'],
    [t('admin'), 'address'],
    [t('issuer'), 'address'],
    [t('freezer'), 'address'],
    [t('decimals')],
    [t('symbol'), 'start'],
    []
  ]);

  return (
    <Table
      className={className}
      empty={assetInfos && t<string>('No assets found')}
      header={headerRef.current}
    >
      {assetInfos?.map((info) => (
        <Asset
          key={info.key}
          value={info}
        />
      ))}
    </Table>
  );
}

export default React.memo(Assets);
