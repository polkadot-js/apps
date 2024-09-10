// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkplan, RegionInfo } from '@polkadot/react-hooks/types';
import type { InfoRow, Occupancy } from '../types.js';

import React, { useMemo } from 'react';

import { Spinner } from '@polkadot/react-components';

import { formatRowInfo } from '../utils.js';
import WorkInfoRow from './WorkInfoRow.js';

interface Props {
  className?: string;
  value: CoreWorkplan & { type: Occupancy, lastBlock: number };
  currentTimeSlice: number
  isExpanded: boolean
  region: RegionInfo | undefined
}

function Workplan ({ currentTimeSlice, isExpanded, region, value: { core, info, lastBlock, type } }: Props): React.ReactElement<Props> {
  const tableData: InfoRow = useMemo(() => {
    return formatRowInfo(info, core, region, currentTimeSlice, type, lastBlock);
  }, [info, core, region, currentTimeSlice, type, lastBlock]);

  if (!tableData) {
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
      {tableData && (
        <tr
          className={` ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}
          key={tableData.core}
          style={{ minHeight: '100px' }}
        >
          <WorkInfoRow data={tableData} />
          <td />
        </tr>
      )}

    </>
  );
}

export default React.memo(Workplan);
