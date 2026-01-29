// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Adapted from https://hackernoon.com/simplifying-responsive-layouts-with-react-hooks-19db73893a7a

import type { WindowSize } from './types.js';

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

export const WindowSizeCtx = React.createContext<WindowSize>(getDimensions());

export function WindowSizeCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const [dimensions, setDimensions] = useState(() => getDimensions());

  useEffect((): () => void => {
    function handleResize (): void {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowSizeCtx.Provider value={dimensions}>
      {children}
    </WindowSizeCtx.Provider>
  );
}
