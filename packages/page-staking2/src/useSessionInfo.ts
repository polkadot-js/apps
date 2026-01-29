// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { PalletStakingActiveEraInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { SessionInfo } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_ACTIVEERA = {
  transform: (activeEra: Option<PalletStakingActiveEraInfo>): BN | null =>
    activeEra.isSome
      ? activeEra.unwrap().index
      : null
};

const OPT_CURRENTERA = {
  transform: (currentEra: Option<u32>): BN | null =>
    currentEra.unwrapOr(null)
};

function useSessionInfoImpl (): SessionInfo {
  const { api } = useApi();
  const activeEra = useCall(api.query.staking.activeEra, undefined, OPT_ACTIVEERA);
  const currentEra = useCall(api.query.staking.currentEra, undefined, OPT_CURRENTERA);
  const currentSession = useCall<u32>(api.query.session.currentIndex);

  return useMemo(
    () => ({ activeEra, currentEra, currentSession }),
    [activeEra, currentEra, currentSession]
  );
}

export default createNamedHook('useSessionInfo', useSessionInfoImpl);
