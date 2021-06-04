// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Option } from '@polkadot/types';
import type { EraIndex } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_BILLION, BN_ZERO, isFunction } from '@polkadot/util';

export default function useStakerPayouts (): BN {
  const { api } = useApi();
  const migrateEraOpt = useCall<Option<EraIndex>>(api.query.staking?.migrateEra);

  return useMemo(
    () => (migrateEraOpt && migrateEraOpt.isSome && migrateEraOpt.unwrap()) || (
      isFunction(api.tx.staking.payoutStakers)
        ? BN_ZERO
        : BN_BILLION
    ),
    [api, migrateEraOpt]
  );
}
