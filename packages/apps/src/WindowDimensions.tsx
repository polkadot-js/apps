// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Adapted from https://hackernoon.com/simplifying-responsive-layouts-with-react-hooks-19db73893a7a

import React, { useEffect, useState } from 'react';

interface Dimensions {
  windowHeight: number;
  windowWidth: number;
}

interface Props {
  children: React.ReactNode;
}

const WindowDimensionsCtx = React.createContext<Dimensions>({ windowHeight: window.innerHeight, windowWidth: window.innerWidth });

function WindowDimensionsProvider ({ children }: Props): React.ReactElement<Props> {
  const [dimensions, setDimensions] = useState({ windowHeight: window.innerHeight, windowWidth: window.innerWidth });

  useEffect(() => {
    const handleResize = () => setDimensions({ windowHeight: window.innerHeight, windowWidth: window.innerWidth });

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <WindowDimensionsCtx.Provider value={dimensions}>
      {children}
    </WindowDimensionsCtx.Provider>
  );
}

export default React.memo(WindowDimensionsProvider);

export { WindowDimensionsCtx };
