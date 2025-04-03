// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InfoRow } from '../types.js';

import React from 'react';

import { Spinner } from '@polkadot/react-components';

import WorkInfoRow from './WorkInfoRow.js';

interface Props {
  className?: string;
  workplanData: InfoRow;
  isExpanded: boolean
}

function Workplan ({ isExpanded, workplanData }: Props): React.ReactElement<Props> {
  if (!workplanData) {
    return (
      <tr
        className={` ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}
        style={{ minHeight: '100px' }}
      >
        <td> <Spinner /> </td>
        <td colSpan={7}></td>
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
