// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

export default function useTipHashes (): string[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.tips?.NewTip, api.events.tips?.TipClosed, api.events.tips?.TipRetracted]);
  const [state, setState] = useState<string[]>();

  useEffect((): void => {
    // while we don't trigger on the previous-gen treasury tips, we can still query them
    const query = (api.query.tips || api.query.treasury)?.tips;

    if (trigger && query) {
      query
        .keys()
        .then((keys) => setState(
          keys.map(({ args: [hash] }) => hash.toHex())
        ))
        .catch(console.error);
    } else {
      setState([]);
    }
  }, [api, trigger]);

  return state;
}
