// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  type: 'warning' | 'error';
}

function Banner ({ children, className = '', type }: Props): React.ReactElement<Props> | null {
  return (
    <div className={`${className} ${type}`}>
      <div className='box'>
        <div className='info'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(Banner)`
  padding: 0 0.5rem 0.5rem;

  &.error {
    .box {
      background: #fdd;
      border-left-color: #9f3a38;
      color: #9f3a38;
    }
  }

  &.warning {
    .box {
      background: #fff6e5;
      border-left-color: darkorange;
    }
  }

  .box {
    border-left-style: solid;
    border-left-width: 0.25rem;
    border-radius: 0 0.25rem 0.25rem 0;
    box-sizing: border-box;
    padding: 1rem 1.5rem;

    .info {
      max-width: 50rem;
    }
  }
`);
