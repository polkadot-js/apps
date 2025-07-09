// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  type: 'warning' | 'error';
}

function Banner ({ children, className = '', type }: Props): React.ReactElement<Props> | null {
  return (
    <StyledArticle className={`${className} ${type} centered`}>
      <div className='box'>
        {children}
      </div>
    </StyledArticle>
  );
}

const StyledArticle = styled.article`
  .box {
    padding: 0 0.5rem;
  }
`;

export default React.memo(Banner);
