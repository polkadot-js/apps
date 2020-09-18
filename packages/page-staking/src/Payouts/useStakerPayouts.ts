// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EraIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useMemo } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

export default function useStakerPayouts (): BN {
  const { api } = useApi();
  const migrateEraOpt = useCall<Option<EraIndex>>(api.query.staking?.migrateEra);

  return useMemo(
    () => (migrateEraOpt && migrateEraOpt.isSome && migrateEraOpt.unwrap()) || (
      isFunction(api.tx.staking.payoutStakers)
        ? new BN(0)
        : new BN(1_000_000_000)
    ),
    [api, migrateEraOpt]
  );
}
