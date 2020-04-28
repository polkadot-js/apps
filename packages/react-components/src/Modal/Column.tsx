// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ColumnProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Column ({ children, className }: ColumnProps): React.ReactElement<ColumnProps> {
  return (
    <div className={`ui--Modal-Column ${className}`}>{children}</div>
  );
}

export default React.memo(styled(Column)`
  &:nth-child(1) {
    flex: 100%;
  }

  &:nth-child(2) {
    display: none;
    flex: 0%;
    font-size: 0.9rem;
    opacity: 0.75;
  }

  @media only screen and (min-width: 1024px) {
    &:nth-child(1),
    &:only-child {
      flex: 0 66.6%;
    }

    &:nth-child(2) {
      box-sizing: border-box;
      display: block;
      flex: 0 33.3%;
      padding-left: 1rem;
    }
  }
`);
