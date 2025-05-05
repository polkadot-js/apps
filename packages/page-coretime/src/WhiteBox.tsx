// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { type ReactNode } from 'react';

import { useTheme } from '@polkadot/react-hooks';

export const WhiteBox = ({ children, style }: { children: ReactNode, style?: React.CSSProperties }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? '#333' : 'white';

  return <div style={{ backgroundColor, borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyItems: 'center', minWidth: '250px', padding: '24px', ...style }}>
    {children}
  </div>;
};
