// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option } from '@polkadot/types';
import type { PalletBrokerConfigRecord } from '@polkadot/types/lookup';
import type { PalletBrokerConfigRecord as SimplifiedPalletBrokerConfigRecord } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

function extractInfo (config: Option<PalletBrokerConfigRecord>): SimplifiedPalletBrokerConfigRecord {
  const c = config.unwrap();

  return {
    advanceNotice: c.advanceNotice?.toNumber(),
    contributionTimeout: c.contributionTimeout?.toNumber(),
    idealBulkProportion: c.idealBulkProportion,
    interludeLength: c.interludeLength?.toNumber(),
    leadinLength: c.leadinLength?.toNumber(),
    limitCoresOffered: c.limitCoresOffered?.isSome ? c.limitCoresOffered?.unwrap().toNumber() : 0,
    regionLength: c.regionLength?.toNumber(),
    renewalBump: c.renewalBump
  };
}

function useBrokerConfigImpl (api: ApiPromise, ready: boolean) {
  const config = useCall<Option<PalletBrokerConfigRecord>>(ready && api?.query.broker.configuration);

  const [state, setState] = useState<SimplifiedPalletBrokerConfigRecord | undefined>();

  useEffect((): void => {
    !!config && !!config.isSome && !!config.toJSON() &&
      setState(
        extractInfo(config)
      );
  }, [config]);

  return state;
}

export const useBrokerConfig = createNamedHook('useBrokerConfig', useBrokerConfigImpl);
