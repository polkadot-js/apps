// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  const { api } = useApi();
  const queued = useCall<unknown[]>(api.derive.democracy.dispatchQueue);

  return queued?.length || 0;
}

export default createNamedHook('useCounter', useCounterImpl);
