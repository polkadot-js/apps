// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Adapted from https://hackernoon.com/simplifying-responsive-layouts-with-react-hooks-19db73893a7a

import type { WindowSize } from './types';

import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

function getDimensions (): WindowSize {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
}

const WindowSizeContext = React.createContext<WindowSize>(getDimensions());

function WindowSizeCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const [dimensions, setDimensions] = useState(() => getDimensions());

  // No unsub, global context - destroyed on app close
  useEffect((): void => {
    window.addEventListener('resize', () => setDimensions(getDimensions()));
  }, []);

  return (
    <WindowSizeContext.Provider value={dimensions}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export { WindowSizeContext, WindowSizeCtxRoot };
