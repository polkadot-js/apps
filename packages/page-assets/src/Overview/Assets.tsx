// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Asset from './Asset';

interface Props {
  className?: string;
  infos?: AssetInfo[];
}

function Assets ({ className, infos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
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
      empty={infos && t<string>('No assets found')}
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
