// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { PropsWithChildren } from 'react';

import { useApi } from '@polkadot/react-hooks';

export const WaitForApi = ({ children }: { children: React.ReactNode }): PropsWithChildren<any> | null => {
  const api = useApi();

  return api.isApiReady ? (children) : null;
};
