// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from '@polkadot/react-hooks';

import useExtensions from './useExtensions';

function useCounterImpl (): number {
  const { count } = useExtensions();

  return count;
}

export default createNamedHook('useCounter', useCounterImpl);
