// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Forcing } from '@polkadot/types/interfaces';
import { DeriveSessionProgress } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

export default function useEraBlocks (era?: BN): BN | undefined {
  const { api } = useApi();
  const depth = useCall<BN>(api.query.staking.historyDepth, []);
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress, []);
  const forcing = useCall<Forcing>(api.query.staking.forceEra, []);
  const [duration, setDuration] = useState<BN | undefined>();

  useEffect((): void => {
    depth && era && forcing && progress && progress.sessionLength.gt(BN_ONE) && setDuration(
      (
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
    );
  }, [api, depth, era, forcing, progress]);

  return duration;
}
