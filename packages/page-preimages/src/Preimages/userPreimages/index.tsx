// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';
import Preimage from './Preimage.js';

interface Props {
  className?: string;
  userPreimages: Record<string, TPreimage[]>
}

const UserPreimages = ({ className, userPreimages }: Props) => {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('my preimages'), 'start', 2],
    [undefined, 'media--1300'],
    [t('hash'), 'start'],
    [t('length'), 'media--1000'],
    [t('status'), 'start media--1100']
  ]);

  return (
    <Table
      className={className}
      empty={Object.values(userPreimages) && t('No hashes found')}
      header={headerRef.current}
    >
      {Object.keys(userPreimages)?.map((depositor) => (
        <Preimage
          depositor={depositor}
          key={depositor}
          preimageInfos={userPreimages[depositor]}
        />
      ))}
    </Table>
  );
};

export default React.memo(UserPreimages);
