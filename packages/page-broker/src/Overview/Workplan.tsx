// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkplanInfo, RegionInfo } from '@polkadot/react-hooks/types';
import type { InfoRow } from '../types.js';

import React, { useEffect, useState } from 'react';

import { Spinner } from '@polkadot/react-components';

import { formatWorkInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';

interface Props {
  className?: string;
  value: CoreWorkplanInfo;
  currentTimeSlice: number
  isExpanded: boolean
  region: RegionInfo | undefined
}

function Workplan ({ currentTimeSlice, isExpanded, region, value: { core, info } }: Props): React.ReactElement<Props> {
  const [tableData, setTableData] = useState<InfoRow[]>();

  useEffect(() => {
    setTableData(formatWorkInfo(info, core, region, currentTimeSlice));
  }, [info, region, core, currentTimeSlice]);

  if (!tableData?.length) {
    return (
      <tr
        className={` ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}
        style={{ minHeight: '100px' }}
      >
        <td> <Spinner /> </td>
        <td colSpan={6}></td>
      </tr>
    );
  }

  return (
    <>
      {tableData?.map((data) => (
        <tr
          className={` ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}
          key={data.core}
          style={{ minHeight: '100px' }}
        >
          <WorkInfoRow data={data} />
          <td />
        </tr>
      ))}

    </>
  );
}

export default React.memo(Workplan);
