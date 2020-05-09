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

function Body ({ children, className, empty, emptySpinner }: Props): React.ReactElement<Props> {
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
    border-top: 1px solid #e6e6e6;
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: middle;

    &:first-child {
      border-left: 1px solid #e6e6e6;
    }

    &:last-child {
      border-right: 1px solid #e6e6e6;
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

    &:hover label {
      opacity: 1;
    }

    &.address {
      min-width: 11rem;
      padding: 0.85rem 1rem;
    }

    &.badge {
      padding: 0;
    }

    &.button {
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
    &.isHighlight td {
      background: #ffffed;
    }

    &:last-child td {
      border-bottom: 1px solid #e6e6e6;
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
`);
