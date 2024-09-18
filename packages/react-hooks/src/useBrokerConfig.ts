// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerConfigRecord } from '@polkadot/types/lookup';
import type { PalletBrokerConfigRecord as SimplifiedPalletBrokerConfigRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { stringToBN } from './utils/dataProcessing.js';

function parseConfig (config: PalletBrokerConfigRecord): SimplifiedPalletBrokerConfigRecord {
  const c = config?.toJSON();

  return {
    advanceNotice: c?.advanceNotice as number || 0,
    contributionTimeout: c?.contributionTimeout as number || 0,
    idealBulkProportion: stringToBN(c?.idealBulkProportion?.toString()) || 0,
    interludeLength: c?.interludeLength as number || 0,
    leadinLength: c?.leadinLength as number || 0,
    limitCoresOffered: c?.limitCoresOffered as number || 0,
    regionLength: c?.regionLength as number || 0,
    renewalBump: stringToBN(c?.renewalBump?.toString()) || 0
  };
}

function useBrokerConfigImpl () {
  const { api, isApiReady } = useApi();

  const config = useCall<PalletBrokerConfigRecord>(isApiReady && api.query.broker.configuration);

  const [state, setState] = useState<SimplifiedPalletBrokerConfigRecord>();

  useEffect((): void => {
    config &&
      setState(
        parseConfig(config)
      );
  }, [config]);

  return state;
}

export const useBrokerConfig = createNamedHook('useBrokerConfig', useBrokerConfigImpl);
