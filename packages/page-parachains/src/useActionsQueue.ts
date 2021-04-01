// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { QueuedAction } from './types';

import { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_EIGHT, BN_FIVE, BN_FOUR, BN_NINE, BN_ONE, BN_SEVEN, BN_SIX, BN_TEN, BN_THREE, BN_TWO } from '@polkadot/util';

const INC = [BN_ONE, BN_TWO, BN_THREE, BN_FOUR, BN_FIVE, BN_SIX, BN_SEVEN, BN_EIGHT, BN_NINE, BN_TEN];

const callOpts = {
  withParams: true
};

export default function useActionsQueue (): QueuedAction[] {
  const { api } = useApi();
  const currentIndex = useCall<SessionIndex>(api.query.session.currentIndex);
  const queryIndexes = useMemo(() => currentIndex && INC.map((i) => currentIndex.add(i)), [currentIndex]);
  const nextActions = useCall<[[BN[]], ParaId[][]]>(queryIndexes && api.query.paras.actionsQueue.multi, [queryIndexes], callOpts);

  return useMemo(
    (): QueuedAction[] =>
      nextActions
        ? nextActions[0][0]
          .map((sessionIndex, index) => ({
            paraIds: nextActions[1][index],
            sessionIndex
          }))
          .filter(({ paraIds }) => paraIds.length)
        : [],
    [nextActions]
  );
}
