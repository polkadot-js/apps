// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

export function useScroll (): number {
  const [scrollY, setScrollY] = useState(window.pageYOffset);
  const setYOffset = useCallback((): void => setScrollY(window.pageYOffset), []);

  useEffect(() => {
    function watchScroll () {
      window.addEventListener('scroll', setYOffset);
    }

    watchScroll();

    return () => {
      window.removeEventListener('scroll', setYOffset);
    };
  }, [setYOffset]);

  return scrollY;
}
