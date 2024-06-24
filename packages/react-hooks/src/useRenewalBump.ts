// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerConfigRecord } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function extractRenewalBump (config: PalletBrokerConfigRecord) {
  return config.toJSON().renewalBump?.toString();
}

function useRenewalBumpImpl () {
  const { api, isApiReady } = useApi();

  const config = useCall<PalletBrokerConfigRecord>(isApiReady && api.query.broker.configuration);

  const [state, setState] = useState<string | undefined>();

  useEffect((): void => {
    config &&
      setState(
        extractRenewalBump(config)
      );
  }, [config]);

  return state;
}

export const useRenewalBump = createNamedHook('useRenewalBump', useRenewalBumpImpl);
