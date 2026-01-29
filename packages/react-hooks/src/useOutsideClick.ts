// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

import { useCallback, useEffect } from 'react';

import { createNamedHook } from './createNamedHook.js';

function isRefClicked (refs: React.RefObject<HTMLDivElement>[], e: MouseEvent): boolean {
  return refs.some((r) =>
    r.current &&
    r.current.contains(e.target as HTMLElement)
  );
}

function useOutsideClickImpl (refs: React.RefObject<HTMLDivElement>[], callback: () => void): void {
  const handleClick = useCallback(
    (e: MouseEvent): void => {
      if (refs.length && !isRefClicked(refs, e)) {
        callback();
      }
    },
    [refs, callback]
  );

  useEffect((): () => void => {
    document.addEventListener('click', handleClick, true);

    return (): void => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [handleClick, callback]);
}

export const useOutsideClick = createNamedHook('useOutsideClick', useOutsideClickImpl);
