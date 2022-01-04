// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, HeadData, ParaId } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeCommonParasRegistrarParaInfo, PolkadotRuntimeParachainsParasParaGenesisArgs, PolkadotRuntimeParachainsParasParaLifecycle } from '@polkadot/types/lookup';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

import { sliceHex } from '../util';

interface Result {
  headHex: string | null;
  lifecycle: PolkadotRuntimeParachainsParasParaLifecycle | null;
  manager: AccountId | null;
}

const optMulti = {
  defaultValue: {
    headHex: null,
    lifecycle: null,
    manager: null
  },
  transform: ([optHead, optGenesis, optLifecycle, optInfo]: [Option<HeadData>, Option<PolkadotRuntimeParachainsParasParaGenesisArgs>, Option<PolkadotRuntimeParachainsParasParaLifecycle>, Option<PolkadotRuntimeCommonParasRegistrarParaInfo>]): Result => ({
    headHex: optHead.isSome
      ? sliceHex(optHead.unwrap())
      : optGenesis.isSome
        ? sliceHex(optGenesis.unwrap().genesisHead)
        : null,
    lifecycle: optLifecycle.unwrapOr(null),
    manager: optInfo.isSome
      ? optInfo.unwrap().manager
      : null
  })
};

function useThreadInfoImpl (id: ParaId): Result {
  const { api } = useApi();

  return useCallMulti<Result>([
    [api.query.paras.heads, id],
    [api.query.paras.upcomingParasGenesis, id],
    [api.query.paras.paraLifecycles, id],
    [api.query.registrar.paras, id]
  ], optMulti);
}

export default createNamedHook('useThreadInfo', useThreadInfoImpl);
