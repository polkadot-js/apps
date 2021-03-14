// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Campaign } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  value: Campaign[] | null;
}

function Funds ({ bestNumber, className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('funds'), 'start', 4],
    [t('slots')],
    [t('raised')],
    [t('end')],
    []
  ]);

  return (
    <Table
      className={className}
      empty={value && t<string>('No campaigns found')}
      header={headerRef.current}
    >
      {value?.map((fund) => (
        <Fund
          bestNumber={bestNumber}
          key={fund.paraId.toString()}
          value={fund}
        />
      ))}
    </Table>
  );
}

export default React.memo(Funds);
