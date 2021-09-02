// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

export default function useEraBlocks (era?: BN): BN | undefined {
  const { api } = useApi();
  const depth = useCall<BN>(api.query.staking.historyDepth);
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const forcing = useCall<Forcing>(api.query.staking.forceEra);

  return useMemo(
    () => (depth && era && forcing && progress && progress.sessionLength.gt(BN_ONE))
      ? (
        forcing.isForceAlways
          ? progress.sessionLength
          : progress.eraLength
      ).mul(
        depth
          .sub(progress.activeEra)
          .iadd(era)
          .iadd(BN_ONE)
      ).isub(
        forcing.isForceAlways
          ? progress.sessionProgress
          : progress.eraProgress
      )
      : undefined,
    [depth, era, forcing, progress]
  );
}
