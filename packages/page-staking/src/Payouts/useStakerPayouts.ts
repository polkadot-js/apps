// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EraIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

export default function useStakerPayouts (): BN {
  const { api } = useApi();
  const [stakerPayoutAfter, setState] = useState<BN>(
    isFunction(api.tx.staking.payoutStakers)
      ? new BN(0)
      : new BN(1_000_000_000)
  );
  const migrateEraOpt = useCall<Option<EraIndex>>(api.query.staking?.migrateEra, []);

  useEffect((): void => {
    migrateEraOpt && migrateEraOpt.isSome && setState(migrateEraOpt.unwrap());
  }, [migrateEraOpt]);

  return stakerPayoutAfter;
}
