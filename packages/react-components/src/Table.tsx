// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { isString } from '@polkadot/util';

import Spinner from './Spinner';

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface BodyProps extends BaseProps {
  empty?: React.ReactNode;
}

interface HeadProps extends BaseProps {
  filter?: React.ReactNode;
}

interface TableProps extends BaseProps {
  isFixed?: boolean;
}

type TableImpl = React.FC<TableProps> & {
  Body: React.FC<BodyProps>;
  Head: React.FC<HeadProps>;
}

function Head ({ children, className, filter }: HeadProps): React.ReactElement<HeadProps> {
  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr>
        {children}
      </tr>
    </thead>
  );
}

function Body ({ children, className, empty }: BodyProps): React.ReactElement<BodyProps> {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <tbody className={className}>
      {isEmpty
        ? (
          <tr><td colSpan={100}>{
            isString(empty)
              ? <div className='empty'>{empty}</div>
              : empty || <Spinner />
          }</td></tr>
        )
        : children
      }
    </tbody>
  );
}

function Table ({ children, className, isFixed }: TableProps): React.ReactElement<TableProps> {
  return (
    <div className={`ui--Table ${isFixed && 'isFixed'} ${className}`}>
      <table>
        {children}
      </table>
    </div>
  );
}

const Memo = React.memo(styled(Table)`
  margin-bottom: 1.5rem;

  &.isFixed table {
    table-layout: fixed;
  }

  table {
    border-spacing: 0;
    overflow: hidden;
    width: 100%;

    thead tr {
      background: #f5f5f5;
      text-transform: lowercase;

      &.filter th {
        padding: 0;
      }
    }

    tbody tr {
      background: white;

      td {
        border-top: 1px solid #e6e6e6;

        &:first-child {
          border-left: 1px solid #e6e6e6;
        }

        &:last-child {
          border-right: 1px solid #e6e6e6;
        }
      }

      &:first-child td {
        &:first-child {
          border-radius: 0.25rem 0 0 0;
        }

        &:last-child {
          border-radius: 0 0.25rem 0 0;
        }
      }

      &:last-child td {
        border-bottom: 1px solid #e6e6e6;

        &:first-child {
          border-radius: 0 0 0 0.25rem;
        }

        &:last-child {
          border-radius: 0 0 0.25rem 0;
        }
      }

      &:not(:hover) {
        .ui.button:not(.isIcon):not(.disabled) {
          background: #eee !important;
          color: #555 !important;
        }

        .ui.toggle.checkbox input:checked~.box:before,
        .ui.toggle.checkbox input:checked~label:before {
          background-color: #eee !important;
        }
      }
    }

    tr {
      width: 100%;

      &.isHighlight td {
        background: #ffffed;
      }

      label {
        opacity: 0.42;
      }

      td, th {
        &:first-child {
          padding-left: 1.5rem;
        }

        &:last-child {
          padding-right: 1.5rem;
        }

        &.all {
          width: 100%;

          summary {
            white-space: normal;
          }
        }
      }

      td {
        padding: 0.75rem 1rem;
        text-align: left;
        vertical-align: middle;

        label {
          display: block !important;
          white-space: nowrap;
        }

        i.icon {
          cursor: pointer;
        }

        div.empty {
          opacity: 0.6;
          padding: 0.25rem;
        }

        .ui--Spinner {
          margin: 0.5rem auto;

          .text {
            margin-bottom: 0;
          }
        }

        &:hover label {
          opacity: 1;
        }

        &.address {
          min-width: 11rem;
          padding: 0.85rem 1rem;
        }

        &.button {
          text-align: right;
          vertical-align: middle;
          white-space: nowrap;
        }

        &.combined {
          border-top-width: 0;
        }

        &.hash {
          font-family: monospace;
        }

        &.number {
          text-align: right;
        }

        &.relative {
          position: relative;
        }

        &.overflow {
          max-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &.together {
          white-space: nowrap;
        }

        &.middle {
          text-align: center;
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
        color: rgba(78, 78, 78, .66);
        font-family: sans-serif;
        font-weight: 100;
        text-align: right;
        padding: 0.75rem 1rem 0.25rem;
        vertical-align: baseline;
        white-space: nowrap;

        h1, h2 {
          font-size: 1.75rem;
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
      }
    }
  }
`) as unknown as TableImpl;

Memo.Body = React.memo(Body);
Memo.Head = React.memo(Head);

export default Memo;
