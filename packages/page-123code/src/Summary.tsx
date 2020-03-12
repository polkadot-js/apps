// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';

interface Props extends BareProps {
  children: React.ReactNode;
}

function Summary ({ children, className, style }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}

export default React.memo(styled(Summary)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);
