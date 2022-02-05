// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UniqueInfo } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Unique from './Unique';

interface Props {
  className?: string;
  infos?: UniqueInfo[];
}

function Uniques ({ className, infos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('class'), 'start', 2],
    [t('owner'), 'address media--700'],
    [t('admin'), 'address media--1000'],
    [t('issuer'), 'address media--1300'],
    [t('freezer'), 'address media--1600'],
    [t('instances')],
    []
  ]);

  return (
    <Table
      className={className}
      empty={infos && t<string>('No unique classes found')}
      header={headerRef.current}
    >
      {infos?.map((info) => (
        <Unique
          key={info.key}
          value={info}
        />
      ))}
    </Table>
  );
}

export default React.memo(Uniques);
