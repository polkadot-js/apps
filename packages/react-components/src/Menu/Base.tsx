// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BaseProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Base ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <div className={`ui--Menu ${className}`}>
      {children}
    </div>
  );
}

export default React.memo(styled(Base)`
  display: flex;
  flex-direction: column;
  min-width: 14.286rem;
  margin: 1rem 0;

  & > *:not(.ui--Menu__Item):not(.ui--Menu__Divider) {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`);
