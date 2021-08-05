// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RefObject, useCallback, useEffect } from 'react';

export const useOutsideClick = (refs: RefObject<HTMLDivElement>[], callback: () => void) => {
  const handleClick = useCallback((e: MouseEvent) => {
    if (refs.length && !refs.find((ref) => ref.current && ref.current.contains(e.target as HTMLElement))) {
      callback();
    }
  }, [refs, callback]);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick, callback]);
};
