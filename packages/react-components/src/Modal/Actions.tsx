// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionsProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

const Actions: React.FC<ActionsProps> = ({ children, className = '' }) => (
  <div className={className}>
    <Button.Group>
      {children}
    </Button.Group>
  </div>
);

export default React.memo(styled(Actions)`
  background-color: var(--bg-input);

  .ui--Button-Group {
    margin: 1rem 1rem;
  }
`);
