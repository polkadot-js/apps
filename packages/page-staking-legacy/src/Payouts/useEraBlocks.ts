// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

function useEraBlocksImpl (historyDepth?: BN, era?: BN): BN | undefined {
  const { api } = useApi();
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const forcing = useCall<Forcing>(api.query.staking.forceEra);

  return useMemo(
    () => (historyDepth && era && forcing && progress && progress.sessionLength.gt(BN_ONE))
      ? (
        forcing.isForceAlways
          ? progress.sessionLength
          : progress.eraLength
      ).mul(
        historyDepth
          .sub(progress.activeEra)
          .iadd(era)
          .iadd(BN_ONE)
      ).isub(
        forcing.isForceAlways
          ? progress.sessionProgress
          : progress.eraProgress
      )
      : undefined,
    [era, forcing, historyDepth, progress]
  );
}

export default createNamedHook('useEraBlocks', useEraBlocksImpl);
