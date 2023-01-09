// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WindowSize } from './ctx/types';

import { useContext } from 'react';

import { WindowSizeCtx } from './ctx/WindowSize';
import { createNamedHook } from './createNamedHook';

function useWindowSizeImpl (): WindowSize {
  return useContext(WindowSizeCtx);

  // const [windowSize, setWindowSize] = useState<WindowSize>({
  //   height: 0,
  //   width: 0
  // });

  // useEffect(() => {
  //   function handleResize () {
  //     setWindowSize({
  //       height: window.innerHeight,
  //       width: window.innerWidth
  //     });
  //   }

  //   window.addEventListener('resize', handleResize);
  //   handleResize();

  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // return windowSize;
}

export const useWindowSize = createNamedHook('useWindowSize', useWindowSizeImpl);
