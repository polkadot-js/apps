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
    <article className={`${className} ${type} nomargin`}>
      <div className='box'>
        {children}
      </div>
    </article>
  );
}

export default React.memo(styled(Banner)`
  &+& {
    margin-top: 0.5rem;
  }

  .box {
    max-width: 50rem;
    padding: 0 0.5rem;
  }
`);
