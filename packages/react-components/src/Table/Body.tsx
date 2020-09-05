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
  empty?: React.ReactNode | false;
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
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: middle;

    // &:first-child {
    //   border-left: 1px solid #e4e6e8;
    // }

    // &:last-child {
    //   border-right: 1px solid #e4e6e8;
    // }

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

    &.button {
      padding: 0.5rem;
      text-align: right;
      white-space: nowrap;

      > * {
        vertical-align: middle;
      }
    }

    &.combined {
      border-top-width: 0;
    }

    &.expand {
      text-align: left;

      .ui--Expander+.ui--Expander {
        margin-top: 0.5rem;
      }
    }

    &.hash {
      font-family: monospace;
    }

    &.links {
      padding: 0.5rem 0.75rem;
      text-align: center;
      width: 0;
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
      padding: 0 !important;
      width: fit-content;
      white-space: normal;

      > div {
        margin-right: 0.75rem;
        max-width: 3.8rem;
        min-width: 3.8rem;
      }
    }

    &.favorite .ui--Icon.isSelected {
      color: darkorange;
    }

    .ui--Button-Group .ui--Button:not(.isToplevel) {
      margin: 0;
    }
  }

  tr {
    &:nth-child(odd) {
      // background: rgba(255, 254, 253, 0.55);
      background: #faf8f6;
    }

    &:nth-child(even) {
      background: rgba(255, 254, 253, 1);
    }

    // &:last-child td {
    //   border-bottom: 1px solid #e4e6e8;
    // }

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

    &.transparent {
      background: transparent;
    }

    .ui--Button:not(.isIcon):not(:hover) {
      background: transparent !important;
      box-shadow: none !important;
    }

    .ui.toggle.checkbox input:checked~.box:before,
    .ui.toggle.checkbox input:checked~label:before {
      background-color: #eee !important;
    }
  }
`);
