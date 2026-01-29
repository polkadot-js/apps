// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

import { useEffect, useRef } from 'react';

import { createNamedHook } from './createNamedHook.js';

export type MountedRef = React.MutableRefObject<boolean>;

function useIsMountedRefImpl (): MountedRef {
  const isMounted = useRef(false);

  useEffect((): () => void => {
    isMounted.current = true;

    return (): void => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

export const useIsMountedRef = createNamedHook('useIsMountedRef', useIsMountedRefImpl);
