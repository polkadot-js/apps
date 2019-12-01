// Copyright 2017-2019 @polkadot/app-staking authors & contributors
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
  padding: 1.5rem 0;

  table {
    border-collapse: collapse;
    width: 100%;

    tr {
      border: 1px solid #f2f2f2;
      border-top-width: 0px;

      &:nth-child(even) {
        background: #f9f9f9;
      }

      &:nth-child(odd) {
        background: white;
      }

      &.isHighlight {
        background: #ffffed;
      }

      td, th {
        text-align: left;

        &.number {
          text-align: right;
        }
      }

      td {
        padding: 0.5rem 0.75rem;

        i.icon {
          cursor: pointer;
        }

        &.favorite i.icon.isSelected {
          color: darkorange;
        }

        &.address {
          white-space: nowrap;
          text-overflow: ellipsis;

          > div  {
            display: inline-block;
            vertical-align: middle;
          }

          > div+div {
            margin-left: 0.75rem;
            max-width: 16rem;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
