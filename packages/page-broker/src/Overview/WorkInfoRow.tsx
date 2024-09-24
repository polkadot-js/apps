// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressMini, styled } from '@polkadot/react-components';

import { type InfoRow, Occupancy } from '../types.js';

const StyledTableCol = styled.td<{ hide?: 'mobile' | 'tablet' | 'both' }>`
  width: 150px;
  vertical-align: top;

  @media (max-width: 768px) {
    /* Mobile */
    ${(props) => props.hide === 'mobile' || props.hide === 'both' ? 'display: none;' : ''}
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet */
    ${(props) => props.hide === 'tablet' || props.hide === 'both' ? 'display: none;' : ''}
  }
`;

const TableCol = ({ header,
  hide,
  value }: {
  header: string;
  value: string | number | null | undefined;
  hide?: 'mobile' | 'tablet' | 'both';
}) => (
  <StyledTableCol hide={hide}>
    <h5 style={{ opacity: '0.6' }}>{header}</h5>
    <p>{value || <>&nbsp;</>}</p>
  </StyledTableCol>
);

function WorkInfoRow ({ data }: { data: InfoRow }): React.ReactElement {
  if (!data.task) {
    return (
      <>
        <td style={{ width: 200 }}>no task</td>
        <td colSpan={6} />
      </>);
  }

  switch (data.type) {
    case (Occupancy.Reservation): {
      return (
        <>
          <TableCol
            header='Task'
            value={data.task}
          />
          <TableCol
            header='Blocks per timeslice'
            value={data.maskBits}
          />
          <TableCol
            header='type'
            value={'Reservation'}
          />
          <td colSpan={4} />
        </>
      );
    }

    case (Occupancy.Lease): {
      return (
        <>
          <TableCol
            header='Task'
            value={data.task}
          />
          <TableCol
            header='Blocks per timeslice'
            value={data.maskBits}
          />
          <TableCol
            header='Start'
            hide='both'
            value={data.start}
          />
          <TableCol
            header='End'
            hide='both'
            value={data.end}
          />
          <TableCol
            header='Last block'
            value={data.endBlock}
          />
          <TableCol
            header='type'
            value={'Legacy Lease'}
          />
          <td colSpan={1} />
        </>);
    }

    default: {
      return (
        <>
          <TableCol
            header='Task'
            value={data.task}
          />
          <TableCol
            header='Blocks per timeslice'
            value={data.maskBits}
          />
          <TableCol
            header='Start'
            hide='both'
            value={data.start}
          />
          <TableCol
            header='End'
            hide='both'
            value={data.end}
          />
          <TableCol
            header='Last block'
            value={data.endBlock}
          />
          <TableCol
            header='type'
            value={'Bulk Coretime'}
          />
          <StyledTableCol hide='mobile'>
            <h5 style={{ opacity: '0.6' }}>{'Owner'}</h5>
            {data.owner
              ? (
                <AddressMini
                  isPadded={false}
                  key={data.owner}
                  value={data.owner}
                />
              )

              : <p>&nbsp;</p>}
          </StyledTableCol>
        </>);
    }
  }
}

export default React.memo(WorkInfoRow);
