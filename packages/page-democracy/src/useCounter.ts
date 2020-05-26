// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState, useEffect } from 'react';
import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const mountedRef = useIsMountedRef();
  const proposals = useCall<any[]>(isApiReady && hasAccounts && api.derive.democracy?.proposals, []);
  const referenda = useCall<any[]>(isApiReady && hasAccounts && api.derive.democracy?.referendumsActive, []);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    mountedRef.current && setCounter(
      (proposals?.length || 0) +
      (referenda?.length || 0)
    );
  }, [mountedRef, proposals?.length, referenda?.length]);

  return counter;
}
