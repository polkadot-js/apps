// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  withBorder?: boolean;
  withPadding?: boolean;
}

function Holder ({ children, className = '', withBorder, withPadding }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Params ${className} ${withBorder ? 'withBorder' : 'withoutBorder'} ${withPadding ? 'withPadding' : ''}`}>
      {children}
    </div>
  );
}

export default React.memo(styled(Holder)`
  &.withBorder {
    border-left: 0.25rem solid #f2f2f2;
  }

  &.withoutBorder {
    margin-left: -1.75rem;
    padding: 0;
  }

  &.withPadding {
    padding-left: 4rem;
  }

  .ui--Param .ui--Labelled label {
    text-transform: none !important;
    font-family: monospace;
  }

  .ui--row {
    flex-wrap: wrap;
  }

  .ui--Param-Address {
    font-family: monospace;
  }

  .ui--Params-Content {
    box-sizing: border-box;
    padding: 0 0 0 1.75rem;
  }

  .ui--Param-text {
    display: inline-block;
    font-size: 1rem;
    line-height: 1.714rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ui--Param-text .icon {
    margin-right: 0.5rem !important;
  }

  .ui--Param-text * {
    vertical-align: middle;
  }

  .ui--Param-text.nowrap {
    white-space: nowrap;
  }

  .ui--Param-text.name {
    color: rgba(0, 0, 0, .6);
    font-style: italic;
  }

  .ui--Param-text + .ui--Param-text {
    margin-left: 0.5rem;
  }

  .ui--Param-Vector-buttons {
    text-align: right;
  }

  .ui--Param-composite {
    position: relative;

    .ui--Param-overlay {
      position: absolute;
      top: 0.5rem;
      right: 3.5rem;
    }
  }
`);
