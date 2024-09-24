// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RegionInfo } from '@polkadot/react-hooks/types';
import type { InfoRow } from '../types.js';

import React from 'react';

import { Spinner } from '@polkadot/react-components';

import WorkInfoRow from './WorkInfoRow.js';

interface Props {
  className?: string;
  workplanData: InfoRow;
  currentTimeSlice: number
  isExpanded: boolean
  region: RegionInfo | undefined
}

function Workplan ({ isExpanded, workplanData }: Props): React.ReactElement<Props> {
  if (!workplanData) {
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
      {workplanData && (
        <tr
          className={` ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}
          key={workplanData.core}
        >
          <WorkInfoRow data={workplanData} />
          <td />
        </tr>
      )}

    </>
  );
}

export default React.memo(Workplan);
