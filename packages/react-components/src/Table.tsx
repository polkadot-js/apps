// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

type BodyProps = BaseProps;

type HeadProps = BaseProps;

type TableProps = BaseProps;

interface TableImpl {
  (props: TableProps): React.ReactElement<TableProps>;
  Body: (props: BodyProps) => React.ReactElement<BodyProps>;
  Head: (props: HeadProps) => React.ReactElement<HeadProps>;
}

function Head ({ children, className }: HeadProps): React.ReactElement<HeadProps> {
  return (
    <thead className={className}>
      <tr>
        {children}
      </tr>
    </thead>
  );
}

function Body ({ children, className }: BodyProps): React.ReactElement<BodyProps> {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

function Table ({ children, className }: TableProps): React.ReactElement<TableProps> {
  return (
    <div className={`ui--Table ${className}`}>
      <table>
        {children}
      </table>
    </div>
  );
}

Table.Body = Body;
Table.Head = Head;

export default styled(Table)`
  margin-bottom: 1.5rem;

  table {
    border-collapse: separate;
    border-spacing: 0 0.25rem;
    width: 100%;

    tr {
      width: 100%;

      &.isHighlight {
        td {
          background: #ffffed;
        }
      }

      label {
        opacity: 0.42;
      }

      &:hover {
        label {
          opacity: 1;
        }

        td {
          border-color: #ccc;
        }
      }

      &:not(:hover) {
        .ui.button:not(.disabled) {
          background: #eee !important;
          color: #555 !important;
        }

        .ui.toggle.checkbox input:checked~.box:before,
        .ui.toggle.checkbox input:checked~label:before {
          background-color: #eee !important;
        }

        .ui.button.mini {
          visibility: hidden;
        }
      }

      td, th {
        text-align: left;

        &.all {
          width: 100%;

          summary {
            white-space: normal;
          }
        }

        &.number {
          text-align: right;
        }

        &.together {
          white-space: nowrap;
        }

        &.toggle {
          cursor: pointer;
        }

        &.top {
          vertical-align: top;

          >.ui--AddressMini.padded:first-child {
            margin-top: -0.25rem;

            .ui--AddressMini-label {
              margin-bottom: 0.25rem;
            }
          }
        }

        &.toppad {
          padding-top: 1.25rem;
          vertical-align: top;
        }
      }

      td {
        background: white;
        border: 1px solid #f2f2f2;
        border-left-width: 0;
        border-right-width: 0;
        padding: 0.5rem 0.75rem;

        label {
          display: block !important;
          white-space: nowrap;
        }

        i.icon {
          cursor: pointer;
        }

        &.mini {
          padding: 0 0.75rem 0 0;
        }

        &:first-child {
          border-left-width: 1px;
          border-radius: 0.25rem 0 0 0.25rem;
        }

        &:last-child {
          border-right-width: 1px;
          border-radius: 0 0.25rem 0.25rem 0;
        }

        &.favorite i.icon.isSelected {
          color: darkorange;
        }
      }

      th {
        background: #666;
        color: #eee;
        font-family: sans-serif;
        font-weight: normal;
        padding: 0.75rem;

        &:first-child {
          border-top-left-radius: 0.25rem;
        }

        &:last-child {
          border-top-right-radius: 0.25rem;
        }
      }
    }
  }
` as any as TableImpl;
