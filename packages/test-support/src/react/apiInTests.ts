// Copyright 2017-2023 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PropsWithChildren } from 'react';
import type React from 'react';

import { useApi } from '@polkadot/react-hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WaitForApi = ({ children }: { children: React.ReactNode }): PropsWithChildren<any> | null => {
  const api = useApi();

  return api.isApiReady ? (children) : null;
};
