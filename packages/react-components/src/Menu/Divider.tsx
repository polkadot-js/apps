// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DividerProps } from '@polkadot/react-components/Menu/types';

import React from 'react';
import styled from 'styled-components';

function Divider ({ className = '' }: DividerProps): React.ReactElement {
  return (
    <div className={`ui--Menu__Divider ${className}`} />
  );
}

export default React.memo(styled(Divider)`
  margin: 0.25rem 0 1rem;
  border-top: 1px solid var(--border-table);

  &:first-child, &:last-child {
    display: none
  }
`);
