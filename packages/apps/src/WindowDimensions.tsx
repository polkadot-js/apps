// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
