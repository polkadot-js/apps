// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { isString } from '@polkadot/util';

import Spinner from '../Spinner';

interface Props {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode;
  emptySpinner?: React.ReactNode;
}

function Body ({ children, className = '', empty, emptySpinner }: Props): React.ReactElement<Props> {
  return (
    <tbody className={className}>
      {children || (
        <tr><td colSpan={100}>{
          isString(empty)
            ? <div className='empty'>{empty}</div>
            : empty || <Spinner label={emptySpinner} />
        }</td></tr>
      )}
    </tbody>
  );
}

export default React.memo(styled(Body)`
  background: white;

  td {
    // border-top: 1px solid #e4e6e8;
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: middle;

    &:first-child {
      border-left: 1px solid #e4e6e8;
    }

    &:last-child {
      border-right: 1px solid #e4e6e8;
    }

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
      margin: 0 auto;

      .text {
        margin-bottom: 0;
      }
    }

    &.address {
      min-width: 11rem;
    }

    &.badge {
      padding: 0;
    }

    &.button {
      padding: 0.5rem 0.75rem;
      text-align: right;
      white-space: nowrap;

      > * {
        vertical-align: middle;
      }

      .ui.button {
        margin-right: 0;
      }
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

    &.top {
      vertical-align: top;
    }

    &.middle {
      text-align: center;
    }

    &.mini {
      max-width: 4rem;
      min-width: 4rem;
      padding: 0 0.75rem 0 0;
      width: 4rem;
      white-space: normal;
    }

    &.favorite i.icon.isSelected {
      color: darkorange;
    }
  }

  tr {
    &:nth-child(even) {
      background: #f9f8f7;
    }

    // &.isHighlight {
    //   &:nth-child(even) td {
    //     background: #fffff4;
    //   }

    //   &:nth-child(odd) td {
    //     background: #f4ffff;
    //   }
    // }

    &:first-child td {
      border-top: 1px solid #e4e6e8;
    }

    &:last-child td {
      border-bottom: 1px solid #e4e6e8;
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
      td:first-child {
        border-bottom-left-radius: 0.25rem;
      }

      td:last-child {
        border-bottom-right-radius: 0.25rem;
      }
    }

    .ui.button:not(.isIcon):not(.disabled):not(:hover) {
      color: #555 !important;

      &:not(.basic) {
        background: transparent !important;
      }

      &.basic {
        background: transparent !important;
        box-shadow: none !important;
      }
    }

    .ui.button+.ui.button {
      margin-left: 0rem;
    }

    .ui.toggle.checkbox input:checked~.box:before,
    .ui.toggle.checkbox input:checked~label:before {
      background-color: #eee !important;
    }
  }
`);
