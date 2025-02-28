// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';

interface Props {
  className?: string;
  userPreimages: Record<string, TPreimage[]>
}

export const UserPreimages = ({ className, userPreimages }: Props) => {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('my preimages'), 'start', 2],
    [t('hash'), 'media--1000'],
    [undefined, 'media--1000'],
    [t('length'), 'media--1000'],
    [t('status'), 'start media--1200']
  ]);

  return (
    <Table
      className={className}
      empty={Object.values(userPreimages) && t('No hashes found')}
      header={headerRef.current}
    >
      {/* {hashes?.map((h) => (
        <Preimage
          cb={onSetAllPreImagesInfo}
          key={h}
          value={h}
        />
      ))} */}
    </Table>
  );
};
