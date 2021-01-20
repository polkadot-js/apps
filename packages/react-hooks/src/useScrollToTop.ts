// Copyright 2017-2021 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';

export default function useScrollToTop (): () => void {
  return useCallback((): void => {
    window.scrollTo(0, 0);
  }, []);
}
