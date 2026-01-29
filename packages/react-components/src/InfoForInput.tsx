// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Labelled from './Labelled.js';
import { styled } from './styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
  type?: 'error' | 'info' | 'warning';
}

function InfoForInput ({ children, className = '', type = 'info' }: Props): React.ReactElement<Props> {
  return (
    <StyledLabelled>
      <div className={`${className} ${type}`}>{children}</div>
    </StyledLabelled>
  );
}

const StyledLabelled = styled(Labelled)`
  background: white;
  border-radius: 0 0 0.25rem 0.25rem;
  margin: -0.5rem 0 0.25rem;
  padding: 1.25rem 1.5rem 1rem;

  &.error {
    background: #db2828;
    color: #eee;
  }

  &.warning {
    background: #ffffe0;
  }

  > ul {
    margin: 0;
    padding: 0;
  }
`;

export default React.memo(InfoForInput);
