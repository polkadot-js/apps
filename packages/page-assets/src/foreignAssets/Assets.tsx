// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ForeignAssetInfo } from '../useForeignAssetInfos.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Asset from './Asset.js';

interface Props {
  className?: string;
  infos?: ForeignAssetInfo[];
}

function Assets ({ className, infos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('foreign assets'), 'start'],
    [],
    [t('owner'), 'address media--1000'],
    [t('admin'), 'address media--1300'],
    [t('issuer'), 'address media--1600'],
    [t('freezer'), 'address media--1900'],
    [t('supply'), 'media--800'],
    [t('holders')]
  ]);

  return (
    <Table
      className={className}
      empty={infos && t('No assets found')}
      header={headerRef.current}
    >
      {infos?.map((info) => (
        <Asset
          key={info.key}
          value={info}
        />
      ))}
    </Table>
  );
}

export default React.memo(Assets);
