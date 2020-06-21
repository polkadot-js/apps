// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { useMemo } from 'react';
import { timeToString } from '@polkadot/react-components/util';
import { useApi } from '@polkadot/react-hooks';
import { BN_ONE, extractTime } from '@polkadot/util';
import { useTranslation } from './translate';

type Result = [number, string];

const DEFAULT_TIME = new BN(6000);

export default function useBlockTime (blocks = BN_ONE): Result {
  const { t } = useTranslation();
  const { api } = useApi();

  return useMemo(
    (): Result => {
      const blockTime = (
        api.consts.babe?.expectedBlockTime ||
        api.consts.timestamp?.minimumPeriod.muln(2) ||
        DEFAULT_TIME
      );

      return [
        blockTime.toNumber(),
        timeToString(t, extractTime(blockTime.mul(blocks).toNumber()))
      ];
    },
    [api, blocks, t]
  );
}
