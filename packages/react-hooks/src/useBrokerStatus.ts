// Copyright 2017-2024 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useBrokerStatusImpl (query: string): string | undefined {
  const { api } = useApi();
  const status = useCall<PalletBrokerStatusRecord>(api.query.broker?.status);
  const [state, setState] = useState<PalletBrokerStatusRecord | undefined>();

  useEffect((): void => {
    status &&
            setState(
              status
            );
  }, [status]);

  return state?.toJSON()?.[query]?.toString();
}

export const useBrokerStatus = createNamedHook('useBrokerStatus', useBrokerStatusImpl);
