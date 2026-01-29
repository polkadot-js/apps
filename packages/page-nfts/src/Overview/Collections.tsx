// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CollectionInfo } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Collection from './Collection.js';

interface Props {
  className?: string;
  infos?: CollectionInfo[];
}

function Collections ({ className, infos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('collections'), 'start', 2],
    [t('owner'), 'address media--1000'],
    [t('status')],
    [t('items')]
  ]);

  return (
    <Table
      className={className}
      empty={infos && t('No collections found')}
      header={headerRef.current}
    >
      {infos?.map((info) => (
        <Collection
          key={info.key}
          value={info}
        />
      ))}
    </Table>
  );
}

export default React.memo(Collections);
