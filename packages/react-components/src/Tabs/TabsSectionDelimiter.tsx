// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import { ThemeProps } from '@polkadot/react-components/types';

interface TabsSectionDelimiterProps {
  className?: string;
}

export function TabsSectionDelimiter ({ className = '' }: TabsSectionDelimiterProps): React.ReactElement {
  return (
    <div className={className}>
      <svg fill='none'
        height='65'
        viewBox='0 0 17 65'
        width='17'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M1 1L16 32.5L1 64'
          stroke='#DFDFDF'/>
      </svg>
    </div>
  );
}

export default React.memo(styled(TabsSectionDelimiter)(({ theme }: ThemeProps) => `
  width: 1.07rem;

  svg {
    height: 100%;
    transform: translateY(1px);
  }
`));
