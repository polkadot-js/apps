// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useUnbondDuration (): BN | undefined {
  const { api } = useApi();
  const eraLength = useCall<BN>(api.derive.session?.eraLength as any, []);
  const [duration, setDuration] = useState<BN | undefined>();

  useEffect((): void => {
    eraLength && setDuration(
      eraLength.mul(api.consts.staking?.bondingDuration)
    );
  }, [api, eraLength]);

  return duration;
}
