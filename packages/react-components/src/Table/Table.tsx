// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TableProps as Props } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import Columar from '../Columar';
import Body from './Body';
import Foot from './Foot';
import Head from './Head';

function extractBodyChildren (children: React.ReactNode): [boolean, React.ReactNode | React.ReactNode[]] {
  if (!Array.isArray(children)) {
    return [!children, children];
  }

  const kids = children.filter((child) => !!child);
  const isEmpty = kids.length === 0;

  return [isEmpty, isEmpty ? null : kids];
}

function Table ({ children, className = '', empty, emptySpinner, filter, footer, header, headerChildren, isFixed, isInline, isSplit, legend, noBodyTag }: Props): React.ReactElement<Props> {
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

  const headerNode = (
    <Head
      filter={filter}
      header={header}
      isEmpty={isEmpty}
    >
      {headerChildren}
    </Head>
  );

  const tableClassName = `${(isFixed && !isEmpty) ? 'isFixed' : 'isNotFixed'} ${isInline ? 'isInline' : ''} ${splitBody ? 'noMargin' : ''}`;

  return (
    <StyledDiv className={`ui--Table ${className} ${splitBody ? 'isSplit' : ''}`}>
      {legend}
      {splitBody
        ? (
          <>
            <table className={tableClassName}>
              {headerNode}
            </table>
            <Columar isPadded={false}>
              <Columar.Column>
                <table className={tableClassName}>
                  <Body>
                    {splitBody[0]}
                  </Body>
                </table>
              </Columar.Column>
              <Columar.Column>
                <table className={tableClassName}>
                  <Body>
                    {splitBody[1]}
                  </Body>
                </table>
              </Columar.Column>
            </Columar>
          </>
        )
        : (
          <table className={tableClassName}>
            {headerNode}
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
    </StyledDiv>
  );
}

const BORDER_RADIUS = '0.5rem';
const BORDER_SOLID = '1px solid var(--bg-page)'; // var(--border-table)

const StyledDiv = styled.div`
  max-width: 100%;
  width: 100%;

  &.isSplit {
    > .ui--Columar {
      margin-bottom: 1.5rem;
    }
  }

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
        border-left: ${BORDER_SOLID};
      }

      &:last-child {
        border-right: ${BORDER_SOLID};
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

      &.number {
        font-variant-numeric: tabular-nums;
        text-align: right;
      }

      &.relative {
        position: relative;

        .absolute {
          position: absolute;
          right: 0.5rem;
          top: 0.75rem;
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
          border-top: ${BORDER_SOLID};
          border-bottom: ${BORDER_SOLID};

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
            border-top: ${BORDER_SOLID};

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
            border-bottom: ${BORDER_SOLID};

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
          border-top: ${BORDER_SOLID};

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
          border-bottom: ${BORDER_SOLID};
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
          border-left: ${BORDER_SOLID};
        }

        &:last-child {
          border-right: ${BORDER_SOLID};
        }
      }
    }
  }
`;

export default React.memo(Table);
