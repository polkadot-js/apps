// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionInfo } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

export default function useUnbondDuration (): BN | undefined {
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionInfo>(api.derive.session.info, []);
  const [duration, setDuration] = useState<BN | undefined>();

  useEffect((): void => {
    // We check sessionLength, for aura this is not properly calculated (not exposed),
    // so the actual real block value would be invalid here
    sessionInfo && sessionInfo.sessionLength.gt(BN_ONE) && setDuration(
      sessionInfo.eraLength.mul(api.consts.staking.bondingDuration)
    );
  }, [api, sessionInfo]);

  return duration;
}
