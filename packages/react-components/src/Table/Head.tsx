// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '../types';

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

export default React.memo(styled(Head)(({ theme }: ThemeProps) => `
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
      border-left: 1px solid ${theme.borderTable};
    }

    &:last-child {
      border-right: 1px solid ${theme.borderTable};
    }

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

    &.start {
      text-align: left;
    }
  }

  tr {
    background: ${theme.bgTable};
    text-transform: lowercase;

    &:first-child {
      th {
        border-top: 1px solid ${theme.borderTable};
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

    &:not(.filter) {
      th {
        color: rgba(${theme.theme === 'dark' ? '254, 240, 240' : '78, 78, 78'}, 0.66);
      }
    }
  }
`));
