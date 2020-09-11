// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type HeaderDef = [React.ReactNode?, string?, number?, (() => void)?];

interface Props {
  className?: string;
  filter?: React.ReactNode;
  header?: (null | undefined | HeaderDef)[];
  isEmpty: boolean;
}

function Head ({ className = '', filter, header, isEmpty }: Props): React.ReactElement<Props> | null {
  if (!header?.length) {
    return null;
  }

  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr>
        {header.filter((h): h is HeaderDef => !!h).map(([label, className = 'default', colSpan = 1, onClick], index) =>
          <th
            className={className}
            colSpan={colSpan}
            key={index}
            onClick={onClick}
          >
            {index === 0
              ? <h1 className='highlight--color'>{label}</h1>
              : isEmpty
                ? ''
                : label
            }
          </th>
        )}
      </tr>
    </thead>
  );
}

export default React.memo(styled(Head)`
  position: relative;
  z-index: 1;

  th {
    font-family: sans-serif;
    font-weight: 100;
    padding: 0.75rem 1rem 0.25rem;
    text-align: right;
    vertical-align: baseline;
    white-space: nowrap;

    h1, h2 {
      font-size: 1.75rem;
    }

    &:first-child {
      border-left: 1px solid #eeecea;
    }

    &:last-child {
      border-right: 1px solid #eeecea;
    }

    &.address {
      padding-left: 3rem;
      text-align: left;
    }

    &.badge {
      padding: 0;
    }

    &.isClickable {
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }

    &.mini {
      padding: 0 !important;
    }

    &.start {
      text-align: left;
    }
  }

  tr {
    background: white;
    text-transform: lowercase;

    &:first-child {
      th {
        border-top: 1px solid #eeecea;
      }
    }

    &:not(.filter) {
      th {
        color: rgba(78, 78, 78, 0.66);
      }
    }

    &.filter {
      .ui.input {
        background: transparent;

        &:first-child {
          margin-top: -1px;
        }
      }

      th {
        padding: 0;
      }
    }
  }
`);
