// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import useApi from './useApi';

export default function useHasInstantiateWithCode (): boolean {
  const { api, isApiReady } = useApi();

  return useMemo(
    (): boolean => isApiReady ? !!api.tx.contracts.instantiateWithCode : false,
    [isApiReady, api]
  );
}
