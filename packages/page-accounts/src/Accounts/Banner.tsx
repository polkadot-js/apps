// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  type: 'warning' | 'error';
}

function Banner ({ children, className = '', type }: Props): React.ReactElement<Props> | null {
  return (
    <article className={`${className} ${type} centered`}>
      <div className='box'>
        {children}
      </div>
    </article>
  );
}

export default React.memo(styled(Banner)`
  .box {
    padding: 0 0.5rem;
  }
`);
