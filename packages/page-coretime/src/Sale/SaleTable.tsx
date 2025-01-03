// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleDetails } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  saleDetails: SaleDetails
}

function SaleTable ({ saleDetails }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [],
    [t('Dates'), 'start media--800'],
    [t('Blocks (relay)'), 'start'],
    [t('Blocks(coretime)'), 'start'],
    [t('Timeslices'), 'start']
  ]);

  return (
    <Table
      emptySpinner={false}
      header={headerRef.current}
      isSplit={false}
    >
      <tr>
        <td>Start</td>
        <td>{saleDetails.date.start}</td>
        <td>{saleDetails.relay.start.block}</td>
        <td>{saleDetails.coretime.start.block}</td>
        <td>{saleDetails.relay.start.ts}</td>
      </tr>
      <tr>
        <td>End</td>
        <td>{saleDetails.date.end}</td>
        <td>{saleDetails.relay.end.block}</td>
        <td>{saleDetails.coretime.end.block}</td>
        <td>{saleDetails.relay.end.ts}</td>
      </tr>

    </Table>
  );
}

export default React.memo(SaleTable);
