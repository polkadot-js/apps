// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

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
              ? label
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
    padding: 0.75rem 1rem 0.57rem;
    font-weight: bold;
    font-size: 0.7rem;
    line-height: 0.85rem;
    text-transform: uppercase;
    color: #4D4D4D;
    vertical-align: baseline;
    white-space: nowrap;

    h1, h2 {
      font-size: 1.75rem;
    }

    h1 {
      .ui--Icon {
        font-size: 1rem;
        margin-right: 0.5rem;
        vertical-align: middle;
      }
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
    text-transform: lowercase;

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
