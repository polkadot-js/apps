// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

export type MountedRef = React.MutableRefObject<boolean>;

export default function useIsMountedRef (): MountedRef {
  const isMounted = useRef(false);

  useEffect((): () => void => {
    isMounted.current = true;

    return (): void => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
