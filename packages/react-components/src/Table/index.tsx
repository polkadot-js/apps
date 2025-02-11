// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useWindowColumns } from '@polkadot/react-hooks';

import { styled } from '../styled.js';
import Column from './Column/index.js';
import Row from './Row/index.js';
import Body from './Body.js';
import Foot from './Foot.js';
import Head from './Head.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  header?: ([React.ReactNode?, string?, number?, (() => void)?] | false | null | undefined)[];
  headerChildren?: React.ReactNode;
  isFixed?: boolean;
  isInline?: boolean;
  isSplit?: boolean;
  legend?: React.ReactNode;
  maxColumns?: 2 | 3;
  noBodyTag?: boolean;
}

const COLUMN_INDEXES = {
  2: [0, 1],
  3: [0, 1, 2]
} as const;

function TableBase ({ children, className = '', empty, emptySpinner, filter, footer, header, headerChildren, isFixed, isInline, isSplit, legend, maxColumns, noBodyTag }: Props): React.ReactElement<Props> {
  const numColumns = useWindowColumns(maxColumns);
  const isArray = Array.isArray(children);
  const isEmpty = !children || (isArray && children.length === 0);

  const headerNode = (
    <Head
      filter={filter}
      header={header}
      isEmpty={isEmpty}
    >
      {headerChildren}
    </Head>
  );

  if (isSplit && isArray && !isEmpty && (numColumns !== 1)) {
    return (
      <StyledDiv className={`${className} ui--Table isSplit`}>
        {legend}
        <table className='noMargin'>
          {headerNode}
        </table>
        <div className='ui--Table-Split'>
          {COLUMN_INDEXES[numColumns].map((column) => (
            <div
              className={`ui--Table-Split-${numColumns}`}
              key={column}
            >
              <table className='noMargin'>
                <tbody className='ui--Table-Body'>
                  {children.filter((_, i) => (i % numColumns) === column)}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </StyledDiv>
    );
  }

  return (
    <StyledDiv className={`${className} ui--Table`}>
      {legend}
      <table className={`${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} ${isInline ? 'isInline' : ''}`}>
        {headerNode}
        <Body
          empty={empty}
          emptySpinner={emptySpinner}
          isEmpty={isEmpty}
          noBodyTag={noBodyTag}
        >
          {children}
        </Body>
        <Foot
          footer={footer}
          isEmpty={isEmpty}
        />
      </table>
    </StyledDiv>
  );
}

const BASE_BORDER = 0.125;
const BORDER_SIDE = `${BASE_BORDER * 1}rem solid var(--bg-page)`;
const BORDER_TOP = `${BASE_BORDER * 2}rem solid var(--bg-page)`;
const BORDER_RADIUS = `${BASE_BORDER * 4}rem`;

const StyledDiv = styled.div`
  max-width: 100%;
  width: 100%;

  .ui--Table-Split {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 1.5rem;

    > .ui--Table-Split-3 {
      max-width: 33.3%;
      min-width: 33.3%;
    }

    > .ui--Table-Split-2 {
      max-width: 50%;
      min-width: 50%;
    }
  }

  table {
    *border-collapse: collapse;
    border-spacing: 0;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
    z-index: 1;

    &.isFixed {
      table-layout: fixed;
    }

    &:not(.isInline):not(.noMargin) {
      margin-bottom: 1.5rem;
    }

    &.isInline {
      tbody tr td {
        border-top-width: 1px;
        padding: 0.25rem 0.75rem;
      }
    }

    tr {
      max-width: 100%;
      width: 100%;

      td,
      &:not(.filter) th {
        &:first-child {
          padding-left: 1.5rem;
        }

        &:last-child {
          padding-right: 0.75rem;
        }

        &.all {
          width: 100%;

          &:not(.overflow) {
            word-break: break-word;
          }

          summary {
            white-space: normal;
          }
        }
      }
    }
  }

  tbody, thead {
    position: relative;
    width: 100%;

    tr {
      width: 100%;
    }
  }

  tbody {
    position: relative;

    td {
      background: var(--bg-table);
      padding: 0.5rem 1rem;
      text-align: left;
      vertical-align: middle;

      > article.mark {
        margin-left: 0rem;
      }

      &:first-child {
        border-left: ${BORDER_SIDE};
      }

      &:last-child {
        border-right: ${BORDER_SIDE};
      }

      label {
        display: block !important;
        white-space: nowrap;
      }

      div.empty {
        opacity: var(--opacity-light);
        padding: 0.25rem;
      }

      .ui--Spinner {
        margin: 0 auto;

        .text {
          margin-bottom: 0;
        }
      }

      &.actions {
        padding-left: 0.35rem;
        width: 1%;

        > div {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: flex-end;

          & > * + * {
            margin-left: 0.35rem;
          }

          .ui--Button {
            white-space: nowrap;
          }
        }

        &:not(:last-child) {
          padding-right: 0;
        }
      }

      &.address {
        max-width: 0;
        min-width: 15rem;
        overflow-x: hidden;
      }

      &.badge {
        padding: 0.5rem;
      }

      &.balance {
        min-width: 20rem;
        padding: 0.5rem 0 0.75rem;
      }

      &.button {
        padding: 0.25rem 0.35rem 0.5rem;
        text-align: right;
        white-space: nowrap;

        > * {
          vertical-align: middle;
        }

        .ui--Toggle {
          display: inline-block;
          white-space: nowrap;

          label {
            display: inline-block !important;
          }
        }
      }

      &.chart {
        padding: 0;
      }

      &.expand {
        &:not(.left) {
          text-align: right;
        }

        .ui--Expander + .ui--Expander {
          margin-top: 0.375rem;
        }
      }

      &.hash {
        // we actually want to use 10ch here, however in the
        // block expand page gives different sizes to the hashes
        min-width: 7.5rem;
        white-space: nowrap;

        > .shortHash {
          max-width: var(--width-shorthash);
          min-width: 3em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: var(--width-shorthash);
        }
      }

      &.links {
        padding: 0.5rem 0.75rem;
        text-align: center;
        width: 0;
      }

      &.no-pad-left {
        padding-left: 0.125rem;
      }

      &.no-pad-right {
        padding-right: 0.125rem;
      }

      &.no-pad-top {
        padding-top: 0.125rem;
      }

      &.no-pad {
        padding: 0;
      }

      &.number {
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      &.relative {
        position: relative;

        .absolute {
          position: absolute;
          right: 0.5rem;
          // this seems aligned with expander (when zoomed in)
          top: 0.72rem;
          white-space: nowrap;
        }
      }

      &.overflow {
        max-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: none;
      }

      &.start {
        text-align: left;
      }

      &.together {
        white-space: nowrap;
      }

      &.top {
        vertical-align: top;
      }

      &.columar {
        vertical-align: top;

        .ui--Columar .ui--Column {
          margin: 1rem 0 0.75rem 0;
          padding: 0;

          * + h5 {
            margin-top: 1rem;
          }

          .ui--Chart-Line {
            padding: 0 0.5rem;
          }
        }
      }

      &.middle {
        text-align: center;
      }

      &.mini {
        padding: 0 !important;
        width: fit-content;
        white-space: normal;

        > div {
          margin-right: 0.75rem;
          max-width: 3.8rem;
          min-width: 3.8rem;
        }
      }

      &.upper {
        text-transform: uppercase;
      }

      .ui--Button-Group .ui--Button:not(.isToplevel) {
        margin: 0;
      }
    }

    tr {
      &:not(.isExpanded) {
        td {
          border-top: ${BORDER_TOP};

          &:first-child {
            border-top-left-radius: ${BORDER_RADIUS};
            border-bottom-left-radius: ${BORDER_RADIUS};
          }

          &:last-child {
            border-top-right-radius: ${BORDER_RADIUS};
            border-bottom-right-radius: ${BORDER_RADIUS};
          }
        }
      }

      &.isExpanded {
        &.isFirst {
          td {
            border-top: ${BORDER_TOP};

            &:first-child {
              border-top-left-radius: ${BORDER_RADIUS};
            }

            &:last-child {
              border-top-right-radius: ${BORDER_RADIUS};
            }
          }
        }

        &.isLast {
          td {
            &:first-child {
              border-bottom-left-radius: ${BORDER_RADIUS};
            }

            &:last-child {
              border-bottom-right-radius: ${BORDER_RADIUS};
            }
          }
        }
      }

      &.packedBottom {
        td {
          padding-bottom: 0;
        }
      }

      &.packedTop {
        td {
          padding-top: 0;
        }
      }

      &.packedAll {
        td {
          padding-bottom: 0;
          padding-top: 0;
        }
      }

      &.transparent {
        background: transparent;
      }

      &.isCollapsed {
        display: none;
      }

      .ui--Button-Group {
        margin: 0;
      }

      .ui--Button:not(.isIcon):not(:hover) {
        background: transparent !important;
        box-shadow: none !important;
      }

      .ui.toggle.checkbox input:checked ~ .box:before,
      .ui.toggle.checkbox input:checked ~ label:before {
        background-color: #eee !important;
      }
    }
  }

  thead {
    tr {
      &:first-child {
        th {
          border-top: ${BORDER_TOP};

          &:first-child {
            border-top-left-radius: ${BORDER_RADIUS};
          }

          &:last-child {
            border-top-right-radius: ${BORDER_RADIUS};
          }
        }
      }

      &:last-child {
        th {
          padding-top: 1rem;

          &:first-child {
            border-bottom-left-radius: ${BORDER_RADIUS};
          }

          &:last-child {
            border-bottom-right-radius: ${BORDER_RADIUS};
          }
        }
      }

      th {
        &:first-child {
          border-left: ${BORDER_SIDE};
        }

        &:last-child {
          border-right: ${BORDER_SIDE};
        }
      }
    }
  }
`;

const Table = React.memo(TableBase) as unknown as typeof TableBase & {
  Column: typeof Column,
  Row: typeof Row
};

Table.Column = Column;
Table.Row = Row;

export default Table;
