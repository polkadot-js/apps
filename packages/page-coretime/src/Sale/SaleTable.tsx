// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  saleDetails: any
  saleNumber: number
}

function SaleTable ({ saleDetails, saleNumber }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t(`details for sale ${saleNumber}`), 'start'],
    [t('start'), 'start media--800'],
    [t('end'), 'start']
  ]);

  return (
    <Table
      emptySpinner={false}
      header={headerRef.current}
      isSplit={false}
    >
      <tr>
        <td>Dates</td>
        <td>{saleDetails.saleStartDate}</td>
        <td>{saleDetails.saleEndDate}</td>
      </tr>
      <tr>
        <td>Blocks(relay)</td>
        <td>{saleDetails.saleStartBlock}</td>
        <td>{saleDetails.saleEndBlock}</td>
      </tr>
      <tr>
        <td>Blocks(coretime)</td>
        <td>{saleDetails.coretime.startBlock}</td>
        <td>{saleDetails.coretime.endBlock}</td>
      </tr>
      <tr>
        <td>Timeslices(coretime)</td>
        <td>{saleDetails.saleStartTimeslice}</td>
        <td>{saleDetails.saleEndTimeslice}</td>
      </tr>

    </Table>
  );
}

export default React.memo(SaleTable);
