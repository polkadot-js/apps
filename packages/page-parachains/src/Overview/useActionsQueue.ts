// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { QueuedAction } from './types';

import { useMemo } from 'react';

import { useApi, useCall, useCallMulti } from '@polkadot/react-hooks';
import { BN_FIVE, BN_FOUR, BN_ONE, BN_THREE, BN_TWO } from '@polkadot/util';

const INC = [BN_ONE, BN_TWO, BN_THREE, BN_FOUR, BN_FIVE];

export default function useActionsQueue (): QueuedAction[] {
  const { api } = useApi();
  const currentIndex = useCall<SessionIndex>(api.query.session.currentIndex);
  const nextActions = useCallMulti<ParaId[][]>(
    currentIndex
      ? INC.map((inc) => [api.query.paras.actionsQueue, currentIndex.add(inc)])
      : []
  );

  return useMemo(
    (): QueuedAction[] =>
      currentIndex && nextActions
        ? nextActions.filter((paraIds) => paraIds.length).map((paraIds, index) => ({
          paraIds,
          sessionIndex: currentIndex.add(INC[index])
        }))
        : [],
    [currentIndex, nextActions]
  );
}
