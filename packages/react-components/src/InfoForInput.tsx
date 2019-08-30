// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { classes } from './util';
import Labelled from './Labelled';

interface Props {
  children: React.ReactNode;
  className?: string;
  type?: 'error' | 'info' | 'warning';
}

const Wrapper = styled.div`
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

export default function InfoForInput ({ children, className, type = 'info' }: Props): React.ReactElement<Props> {
  return (
    <Labelled>
      <Wrapper className={classes(className, type)}>{children}</Wrapper>
    </Labelled>
  );
}
