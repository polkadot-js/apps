// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InfoRow } from '../types.js';

import React from 'react';

import { AddressMini } from '@polkadot/react-components';

const TableCol = ({ className, header, value }: { header: string, value: string | number | null | undefined, className?: React.CSSProperties}) =>
  <td style={{ ...className, verticalAlign: 'top' }}>
    <h5 style={{ opacity: '0.6' }}>{header}</h5>
    <p>{value}</p>
  </td>;

function WorkInfoRow ({ data }: {data: InfoRow}): React.ReactElement {
  const NoTaskAssigned = !data.taskId;

  if (NoTaskAssigned) {
    return (
      <>
        <td style={{ width: 200 }}>no task assigned</td>
        <td colSpan={5} />
      </>);
  }

  return (
    <>
      <TableCol
        className={{ width: 200 }}
        header='TaskId (assignment)'
        value={data.taskId}
      />
      <td style={{ width: 200 }}>
        <h5 style={{ opacity: '0.6' }}>{'Block/timeslice'}</h5>
        <div>{data.maskBits}</div>
      </td>
      <TableCol
        header='Lease start'
        value={data.start}
      />
      <TableCol
        header='Lease end'
        value={data.end}
      />
      <TableCol
        header='Lease end at block'
        value={data.endBlock}
      />
      <td>{!!data.owner &&
        <>
          <h5 style={{ opacity: '0.6' }}>{'Owner'}</h5>
          <AddressMini
            isPadded={false}
            key={data.owner}
            value={data.owner}
          /></>}
      </td>
    </>
  );
}

export default React.memo(WorkInfoRow);
