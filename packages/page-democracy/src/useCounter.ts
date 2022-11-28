// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const mountedRef = useIsMountedRef();
  const proposals = useCall<unknown[]>(isApiReady && hasAccounts && api.derive.democracy?.proposals);
  const referenda = useCall<unknown[]>(isApiReady && hasAccounts && api.derive.democracy?.referendumsActive);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    mountedRef.current && setCounter(
      (proposals?.length || 0) +
      (referenda?.length || 0)
    );
  }, [mountedRef, proposals, referenda]);

  return counter;
}

export default createNamedHook('useCounter', useCounterImpl);
