// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Asset from './Asset.js';

interface Props {
  className?: string;
  infos?: AssetInfo[];
}

function Assets ({ className, infos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('assets'), 'start', 2],
    [t('owner'), 'address media--1000'],
    [t('admin'), 'address media--1300'],
    [t('issuer'), 'address media--1600'],
    [t('freezer'), 'address media--1900'],
    [t('supply')],
    []
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
