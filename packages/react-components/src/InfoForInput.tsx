// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Labelled from './Labelled';

interface Props {
  children: React.ReactNode;
  className?: string;
  type?: 'error' | 'info' | 'warning';
}

function InfoForInput ({ children, className = '', type = 'info' }: Props): React.ReactElement<Props> {
  return (
    <Labelled>
      <div className={`${className} ${type}`}>{children}</div>
    </Labelled>
  );
}

export default React.memo(styled(InfoForInput)`
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
`);
