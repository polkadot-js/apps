// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ColumnProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Columns ({ children, className }: ColumnProps): React.ReactElement<ColumnProps> {
  return (
    <div className={`ui--Modal-Columns ${className}`}>{children}</div>
  );
}

export default React.memo(styled(Columns)`
  display: flex;
  flex-layout: row;
  align-items: center;

  &+& {
    margin-top: 1rem;
  }
`);
