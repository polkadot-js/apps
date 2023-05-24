// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { SessionInfo } from './types.js';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

const OPT_MULTI = {
  transform: ([sessionCurrentIndex, validators, optLastPruned, activeValidatorIndices]: [u32, AccountId[], Option<u32>, u32[]]): SessionInfo => {
    const sessionValidators = validators.map((v) => v.toString());
    const sessionIndexes: BN[] = [sessionCurrentIndex];

    if (optLastPruned.isSome) {
      const lastPruned = optLastPruned.unwrap();
      const nextIndex = sessionCurrentIndex.sub(BN_ONE);

      while (nextIndex.gt(lastPruned)) {
        sessionIndexes.push(nextIndex);
        nextIndex.isub(BN_ONE);
      }
    }

    return {
      paraValidators: activeValidatorIndices.map((i) => sessionValidators[i.toNumber()]),
      sessionCurrentIndex,
      sessionIndexes,
      sessionValidators
    };
  }
};

function useSessionInfoImpl (): SessionInfo | undefined {
  const { api } = useApi();

  return useCallMulti<SessionInfo>([
    api.query.session?.currentIndex,
    api.query.session?.validators,
    api.query.parasDisputes?.lastPrunedSession,
    api.query.parasShared?.activeValidatorIndices
  ], OPT_MULTI);
}

export default createNamedHook('useSessionInfo', useSessionInfoImpl);
