// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { SessionInfo } from './types.js';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const OPT_MULTI = {
  transform: ([sessionIndex, validators, activeValidatorIndices]: [u32, AccountId[], u32[]]): SessionInfo => {
    const sessionValidators = validators.map((v) => v.toString());

    return {
      paraValidators: activeValidatorIndices.map((i) => sessionValidators[i.toNumber()]),
      sessionIndex,
      sessionValidators
    };
  }
};

function useSessionInfoImpl (): SessionInfo | undefined {
  const { api } = useApi();

  return useCallMulti<SessionInfo>([
    api.query.session?.currentIndex,
    api.query.session?.validators,
    api.query.parasShared?.activeValidatorIndices
  ], OPT_MULTI);
}

export default createNamedHook('useSessionInfo', useSessionInfoImpl);
