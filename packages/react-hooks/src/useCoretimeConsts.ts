// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainConstants } from './types.js';

import { useEffect, useState } from 'react';

import { useApi, useBlockTime } from '@polkadot/react-hooks';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';

function useCoretimeConstsImpl (): ChainConstants | undefined {
  const { api, apiCoretime, isApiReady } = useApi();
  const [coretimeConstants, setCoretimeConstants] = useState<ChainConstants | undefined>();

  const [blockTimeMsRelayChain] = useBlockTime(BN_ONE, api);
  const blockTimeMsCoretimeChain = apiCoretime?.consts.aura?.slotDuration;
  const blocksPerTimesliceRelayChain = apiCoretime?.consts.broker?.timeslicePeriod;

  useEffect(() => {
    if (!isApiReady || !blockTimeMsRelayChain || !blockTimeMsCoretimeChain || !blocksPerTimesliceRelayChain) {
      return;
    }

    const blockTimeMsCoretimeChainBN = new BN(blockTimeMsCoretimeChain.toString());
    const blocksPerTimesliceRelayChainBN = new BN(blocksPerTimesliceRelayChain);
    const relationConstant = blockTimeMsCoretimeChainBN.div(new BN(blockTimeMsRelayChain));

    const blocksPerTimesliceCoretimeChain = relationConstant.gtn(0)
      ? blocksPerTimesliceRelayChainBN.div(relationConstant)
      : BN_ZERO;

    setCoretimeConstants({
      coretime: {
        blocksPerTimeslice: blocksPerTimesliceCoretimeChain.toNumber(),
        blocktimeMs: blockTimeMsCoretimeChainBN.toNumber()
      },
      relay: {
        blocksPerTimeslice: blocksPerTimesliceRelayChainBN.toNumber(),
        blocktimeMs: blockTimeMsRelayChain
      }
    });
  }, [isApiReady, blockTimeMsRelayChain, blockTimeMsCoretimeChain, blocksPerTimesliceRelayChain]);

  return coretimeConstants;
}

export const useCoretimeConsts = createNamedHook('useCoretimeConsts', useCoretimeConstsImpl);
