// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

export function useScroll (): number {
  const [scrollY, setScrollY] = useState(0);

  function logit () {
    setScrollY(window.pageYOffset);
  }

  useEffect(() => {
    function watchScroll () {
      window.addEventListener('scroll', logit);
    }

    watchScroll();

    return () => {
      window.removeEventListener('scroll', logit);
    };
  }, []);

  return scrollY;
}
