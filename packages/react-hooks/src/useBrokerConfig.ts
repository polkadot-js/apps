// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerConfigRecord } from '@polkadot/types/lookup';
import type { PalletBrokerConfigRecord as SimplifiedPalletBrokerConfigRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { stringToBN } from './utils/dataProcessing.js';

function parseConfig (config: PalletBrokerConfigRecord): SimplifiedPalletBrokerConfigRecord {
  return {
    advanceNotice: config.advanceNotice.toNumber(),
    contributionTimeout: config.contributionTimeout.toNumber(),
    idealBulkProportion: stringToBN(config.idealBulkProportion?.toString()),
    interludeLength: config.interludeLength.toNumber(),
    leadinLength: config.leadinLength.toNumber(),
    limitCoresOffered: config.limitCoresOffered.isSome ? config.limitCoresOffered.unwrap().toNumber() : 0,
    regionLength: config.regionLength.toNumber(),
    renewalBump: stringToBN(config.renewalBump?.toString())
  };
}

function useBrokerConfigImpl () {
  const { api, isApiReady } = useApi();

  const config = useCall<PalletBrokerConfigRecord>(isApiReady && api.query.broker.configuration);

  const [state, setState] = useState<SimplifiedPalletBrokerConfigRecord>();

  useEffect((): void => {
    !!config && !!config.toJSON() &&
      setState(
        parseConfig(config)
      );
  }, [config]);

  return state;
}

export const useBrokerConfig = createNamedHook('useBrokerConfig', useBrokerConfigImpl);
