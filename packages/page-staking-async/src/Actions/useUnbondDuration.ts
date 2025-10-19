// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionInfo } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useCall, useStakingAsyncApis } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

function useUnbondDurationImpl (): BN | undefined {
  const { ahApi: api } = useStakingAsyncApis();
  const sessionInfo = useCall<DeriveSessionInfo>(api?.derive.session.info);

  return useMemo(
    () => (sessionInfo && sessionInfo.sessionLength.gt(BN_ONE))
      ? sessionInfo.eraLength.mul(api?.consts.staking.bondingDuration ?? BN_ZERO)
      : undefined,
    [api, sessionInfo]
  );
}

export default createNamedHook('useUnbondDuration', useUnbondDurationImpl);
