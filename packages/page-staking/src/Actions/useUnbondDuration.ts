// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveSessionInfo } from '@polkadot/api-derive/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

function useUnbondDurationImpl (): BN | undefined {
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionInfo>(api.derive.session.info);

  return useMemo(
    () => (sessionInfo && sessionInfo.sessionLength.gt(BN_ONE))
      ? sessionInfo.eraLength.mul(api.consts.staking.bondingDuration)
      : undefined,
    [api, sessionInfo]
  );
}

export default createNamedHook('useUnbondDuration', useUnbondDurationImpl);
