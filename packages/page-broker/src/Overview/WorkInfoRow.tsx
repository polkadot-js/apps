// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';

import React from 'react';

import { AddressMini, styled, Tag } from '@polkadot/react-components';
import { CoreTimeTypes } from '@polkadot/react-hooks/constants';

import { type InfoRow } from '../types.js';

const colours: Record<string, string> = {
  [CoreTimeTypes.Reservation]: 'orange',
  [CoreTimeTypes.Lease]: 'blue',
  [CoreTimeTypes['Bulk Coretime']]: 'pink',
  [CoreTimeTypes['On Demand']]: 'green'
};

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
        <td colSpan={7} />
      </>);
  }

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
        header='Start ts'
        hide='both'
        value={data.startTimeslice}
      />
      <TableCol
        header='Start date'
        hide='both'
        value={data.start}
      />
      <TableCol
        header='End date'
        hide='both'
        value={data.end}
      />
      <TableCol
        header='Last block (relay)'
        value={data.endBlock}
      />
      <StyledTableCol hide={'mobile'}>
        <h5 style={{ opacity: '0.6' }}>type</h5>
        {typeof data.type === 'number' && data.type in CoreTimeTypes && (
          <Tag
            color={colours[data.type] as FlagColor}
            label={Object.values(CoreTimeTypes)[data.type]}
          />
        )}
      </StyledTableCol>
      {data.owner
        ? <StyledTableCol hide='mobile'>
          <h5 style={{ opacity: '0.6' }}>{'Owner'}</h5>
          <AddressMini
            isPadded={false}
            key={data.owner}
            value={data.owner}
          />

        </StyledTableCol>
        : <td></td>}
    </>);
}

export default React.memo(WorkInfoRow);
