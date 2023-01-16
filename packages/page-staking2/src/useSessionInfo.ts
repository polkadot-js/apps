// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletStakingActiveEraInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { SessionInfo } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const EMPTY_RESULT: SessionInfo = { activeEra: null };

const OPT_ACTIVEERA = {
  transform: (activeEra: Option<PalletStakingActiveEraInfo>): BN | null =>
    activeEra.isSome
      ? activeEra.unwrap().index
      : null
};

function useSessionInfoImpl (): SessionInfo {
  const { api } = useApi();
  const activeEra = useCall(api.query.staking.activeEra, undefined, OPT_ACTIVEERA);

  return useMemo(
    () => activeEra
      ? { activeEra }
      : EMPTY_RESULT,
    [activeEra]
  );
}

export default createNamedHook('useSessionInfo', useSessionInfoImpl);
