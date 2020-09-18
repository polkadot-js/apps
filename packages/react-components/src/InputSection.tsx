// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface InputSectionProps {
  children: ReactNode,
  className?: string,
}

const InputSection = ({ children, className }: InputSectionProps) => (
  <div className={className}>{children}</div>
);

export default React.memo(styled(InputSection)`
  & + & {
    margin-top: 17px;
  }
`);
