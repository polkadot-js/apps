// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ContentProps } from './types';

import React from 'react';
import styled from 'styled-components';

function Content ({ children, className = '' }: ContentProps) {
  return (
    <div className={`${className} ui--Modal__Content`}>
      {children}
    </div>
  );
}

export default React.memo(styled(Content)`
  padding: 1.5rem;
`);
