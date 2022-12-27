// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styled from 'styled-components';

import Columar from '../Columar';
import Body from './Body';
import Foot from './Foot';
import Head from './Head';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  header?: [React.ReactNode?, string?, number?, (() => void)?][];
  headerChildren?: React.ReactNode;
  isFixed?: boolean;
  isInline?: boolean;
  isSplit?: boolean;
  legend?: React.ReactNode;
  noBodyTag?: boolean;
  withCollapsibleRows: boolean;
}

function extractBodyChildren (children: React.ReactNode): [boolean, React.ReactNode] {
  if (!Array.isArray(children)) {
    return [!children, children];
  }

  const kids = children.filter((child) => !!child);
  const isEmpty = kids.length === 0;

  return [isEmpty, isEmpty ? null : kids];
}

function Table ({ children, className = '', empty, emptySpinner, filter, footer, header, headerChildren, isFixed, isInline, isSplit, legend, noBodyTag, withCollapsibleRows = false }: TableProps): React.ReactElement<TableProps> {
  const [isEmpty, bodyChildren] = extractBodyChildren(children);
  const splitBody = useMemo(
    (): [React.ReactNode[], React.ReactNode[]] | null => {
      if (!isSplit || isEmpty || !Array.isArray(bodyChildren) || bodyChildren.length === 0) {
        return null;
      }

      const half = Math.ceil(bodyChildren.length / 2);

      return [bodyChildren.slice(0, half), bodyChildren.slice(half)];
    },
    [bodyChildren, isEmpty, isSplit]
  );

  return (
    <div className={`ui--Table ${className}`}>
      {legend}
      {splitBody
        ? (
          <Columar isPaddedSmall>
            <Columar.Column>
              <table className={`${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} ${isInline ? 'isInline' : ''} ${withCollapsibleRows ? 'withCollapsibleRows' : ''}`}>
                <Head header={header}>
                  {headerChildren}
                </Head>
                <Body>
                  {splitBody[0]}
                </Body>
              </table>
            </Columar.Column>
            <Columar.Column>
              <table className={`${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} ${isInline ? 'isInline' : ''} ${withCollapsibleRows ? 'withCollapsibleRows' : ''}`}>
                <Head header={header}>
                  {headerChildren}
                </Head>
                <Body>
                  {splitBody[1]}
                </Body>
              </table>
            </Columar.Column>
          </Columar>
        )
        : (
          <table className={`${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} ${isInline ? 'isInline' : ''} ${withCollapsibleRows ? 'withCollapsibleRows' : ''}`}>
            <Head
              filter={filter}
              header={header}
              isEmpty={isEmpty}
            >
              {headerChildren}
            </Head>
            <Body
              empty={empty}
              emptySpinner={emptySpinner}
              noBodyTag={noBodyTag}
            >
              {bodyChildren}
            </Body>
            <Foot
              footer={footer}
              isEmpty={isEmpty}
            />
          </table>
        )
      }
    </div>
  );
}

export default React.memo(styled(Table)`
  max-width: 100%;
  width: 100%;

  table {
    border-spacing: 0;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
    z-index: 1;

    &.isFixed {
      table-layout: fixed;
    }

    &:not(.isInline) {
      margin-bottom: 1.5rem;
    }

    &.isInline {
      tbody tr {
        td {
          border-top-width: 1px;
          padding: 0.25rem 0.75rem;
        }
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

    tbody tr {
      background-color: var(--bg-table);
    }
  }

  tbody, thead {
    position: relative;
    max-width: 100%;
    width: 100%;

    tr {
      max-width: 100%;
      width: 100%;
    }
  }

  tbody {
    td {
      border-bottom: 0.25rem solid var(--border-table);
      padding: 0.5rem 1rem;
      text-align: left;
      vertical-align: middle;

      > article.mark {
        margin-left: 0rem;
      }

      &:first-child {
        border-left: 1px solid var(--border-table);
      }

      &:last-child {
        border-right: 1px solid var(--border-table);
      }

      label {
        display: block !important;
        white-space: nowrap;
      }

      div.empty {
        opacity: 0.6;
        padding: 0.25rem;
      }

      .ui--Spinner {
        margin: 0 auto;

        .text {
          margin-bottom: 0;
        }
      }

      &.address {
        min-width: 11rem;
        overflow-x: hidden;
      }

      &.badge {
        padding: 0.5rem;
      }

      &.balance {
        min-width: 20rem;
      }

      &.button {
        padding: 0.25rem 0.5rem;
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

      &.combined {
        border-top-width: 0;
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
        font: var(--font-mono);
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

      &.number {
        text-align: right;
      }

      &.relative {
        position: relative;

        .absolute {
          position: absolute;
          right: 0.125rem;
          top: 0.375rem;
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

      &.favorite .ui--Icon.isSelected {
        color: darkorange;
      }

      .ui--Button-Group .ui--Button:not(.isToplevel) {
        margin: 0;
      }
    }

    tr {
      td {
        border-bottom: 0.25rem solid var(--border-table);
      }

      &:first-child {
        td:first-child {
          border-top-left-radius: 0.25rem;
        }

        td:last-child {
          border-top-right-radius: 0.25rem;
        }
      }

      &:last-child {
        td {
          &:first-child {
            border-bottom-left-radius: 0.25rem;
          }

          :last-child {
            border-bottom-right-radius: 0.25rem;
          }
        }
      }

      &.transparent {
        background: transparent;
      }

      &.noBorder td {
        border-bottom: 1px solid transparent;
        padding-bottom: 0 !important;
      }

      &.isCollapsed {
        visibility: collapse;
      }

      &.isExpanded {
        visibility: visible;
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
`);
