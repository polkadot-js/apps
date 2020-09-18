// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

export default function useCounter (): number {
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
