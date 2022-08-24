// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionInfo } from '@polkadot/api-derive/types';

import { useMemo } from 'react';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_ONE } from '@polkadot/util';

function useUnbondDurationImpl (): BN | undefined {
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionInfo>(api.derive.session.info);
  const isDarwinia = rpcNetwork.isDarwinia();

  return useMemo(
    () => (sessionInfo && sessionInfo.sessionLength.gt(BN_ONE))
      ? (() => {
        if (isDarwinia) {
          return new BN(api.consts.staking.bondingDurationInBlockNumber.toString());
        }

        return sessionInfo.eraLength.mul(api.consts.staking.bondingDuration);
      })()
      : undefined,
    [api, sessionInfo, isDarwinia]
  );
}

export default createNamedHook('useUnbondDuration', useUnbondDurationImpl);
