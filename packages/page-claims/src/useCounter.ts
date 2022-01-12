// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from '@polkadot/react-hooks';

import usePolkadotPreclaims from './usePolkadotPreclaims';

function useCounterImpl (): number {
  const needAttest = usePolkadotPreclaims();

  return needAttest.length;
}

export default createNamedHook('useCounter', useCounterImpl);
