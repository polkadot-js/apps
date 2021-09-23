// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

type HeaderDef = [React.ReactNode?, string?, number?, (() => void)?];

interface Props {
  className?: string;
  filter?: React.ReactNode;
  header?: (null | undefined | HeaderDef)[];
  name: string;
  isEmpty: boolean;
  isFixed?: boolean;
}

function Head ({ className = '', filter, header, isEmpty, isFixed = false, name }: Props): React.ReactElement<Props> {
  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr className='tableName'>
        <th colSpan={isFixed ? header?.reduce((prev, curr) => prev + (curr ? curr[2] || 1 : 0), 0) ?? 1 : 100}>{name}</th>
      </tr>
      {header && !isEmpty && (
        <tr className='headers'>
          {header.filter((h): h is HeaderDef => !!h).map(([label, className = 'default', colSpan = 1, onClick], index) =>
            <th
              className={className}
              colSpan={colSpan}
              key={index}
              onClick={onClick}
            >
              {label}
            </th>
          )}
        </tr>
      )}
    </thead>
  );
}

export default React.memo(styled(Head)`
  position: relative;
  z-index: 1;

  th {
    font: var(--font-sans);
    font-size: 0.714rem;
    font-weight: var(--font-weight-normal);
    padding: 0.375rem 1rem;
    text-align: right;
    vertical-align: middle;
    white-space: nowrap;

    &.address {
      padding-left: 3rem;
      text-align: left;
    }

    &.badge {
      padding: 0;
    }

    &.expand {
      text-align: right;
    }

    &.isClickable {
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }

    &.mini {
      padding: 0 !important;
    }

    &.no-pad-left {
      padding-left: 0.125rem;
    }

    &.no-pad-right {
      padding-right: 0.125rem;
    }

    &.start {
      text-align: left;
    }

    &.balances {
      text-align: right;
      padding-right: 2.25rem;
    }
  }

  tr {

    background: var(--bg-page);

    &.headers {
      text-transform: uppercase;
    }

    &.filter {
      .ui.input,
      .ui.selection.dropdown {
        background: transparent;
      }

      th {
        padding: 0;
      }
    }

    &.tableName {
      th {
        text-transform: lowercase;
        text-align: left;
        font-size: 1.43rem;
        padding-left: 0;
      }
    }

    &.headers th:first-child {
      padding-left: 0;
    }

    &:not(.filter):not(.tableName) {
      th {
        color: var(--color-table-head);
      }
    }
  }
`);
