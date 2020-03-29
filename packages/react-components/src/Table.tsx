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

type TableImpl = React.FC<TableProps> & {
  Body: React.FC<BodyProps>;
  Head: React.FC<HeadProps>;
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

const Memo = React.memo(styled(Table)`
  margin-bottom: 1.5rem;
  margin-top: 0.25rem;

  table {
    border: 1px solid #f2f2f2;
    border-radius: 0.25rem;
    border-spacing: 0;
    overflow: hidden;
    width: 100%;

    thead tr {
      background: #f5f5f5;
    }

    tbody tr {
      background: white;
    }

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
        padding: 0.5rem 0.75rem;
        vertical-align: middle;

        &.all {
          width: 100%;

          summary {
            white-space: normal;
          }
        }
      }

      td {
        border-top: 1px solid #f2f2f2;
        text-align: left;

        label {
          display: block !important;
          white-space: nowrap;
        }

        i.icon {
          cursor: pointer;
        }

        &.address {
          min-width: 11rem;
          padding: 0.85rem 1rem;

          > .ui--AddressMini,
          > .ui--AddressMini.padded {
            label.ui--AddressMini-label {
              margin-bottom: -0.3rem;
            }
          }
        }

        &.button {
          text-align: right;
          vertical-align: middle;
          white-space: nowrap;
        }

        &.number {
          text-align: right;
        }

        &.together {
          white-space: nowrap;
        }

        &.mini {
          padding: 0 0.75rem 0 0;
          white-space: nowrap;
        }

        &.favorite i.icon.isSelected {
          color: darkorange;
        }
      }

      th {
        color: #888;
        font-family: sans-serif;
        font-weight: 400;
        text-align: right;
        white-space: nowrap;

        &:first-child {
          border-top-left-radius: 0.25rem;
        }

        &:last-child {
          border-top-right-radius: 0.25rem;
        }

        &.isClickable {
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        &.address {
          text-align: left;
          padding-left: 3rem;
        }

        &.start {
          text-align: left;
        }

        &.toggle {
          cursor: pointer;
        }
      }
    }
  }
`) as unknown as TableImpl;

Memo.Body = React.memo(Body);
Memo.Head = React.memo(Head);

export default Memo;
