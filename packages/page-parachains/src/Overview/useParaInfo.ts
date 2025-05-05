// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, BlockNumber, CandidatePendingAvailability, HeadData, ParaId } from '@polkadot/types/interfaces';
import type { PolkadotRuntimeCommonParasRegistrarParaInfo, PolkadotRuntimeParachainsParasParaLifecycle } from '@polkadot/types/lookup';
import type { Codec, ITuple } from '@polkadot/types/types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

type QueryResult = [Option<HeadData>, Option<BlockNumber>, Option<PolkadotRuntimeParachainsParasParaLifecycle>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Option<BlockNumber>, Option<CandidatePendingAvailability>, Option<PolkadotRuntimeCommonParasRegistrarParaInfo>, Option<ITuple<[AccountId, BalanceOf]>>[]];

interface Result {
  headHex: string | null;
  leases: number[];
  lifecycle: PolkadotRuntimeParachainsParasParaLifecycle | null;
  paraInfo: PolkadotRuntimeCommonParasRegistrarParaInfo | null;
  pendingAvail: CandidatePendingAvailability | null;
  updateAt: BlockNumber | null;
  qDmp: number;
  qUmp: number;
  qHrmpE: number;
  qHrmpI: number;
  watermark: BlockNumber | null;
}

const MULTI_OPTS = {
  defaultValue: {
    headHex: null,
    leases: [],
    lifecycle: null,
    paraInfo: null,
    pendingAvail: null,
    qDmp: 0,
    qHrmpE: 0,
    qHrmpI: 0,
    qUmp: 0,
    updateAt: null,
    watermark: null
  },
  transform: ([headData, optUp, optLifecycle, dmp, ump, hrmpE, hrmpI, optWm, optPending, optInfo, leases]: QueryResult): Result => ({
    headHex: headData.isSome
      ? headData.unwrap().toHex()
      : null,
    leases: leases
      .map((opt, index) => opt.isSome ? index : -1)
      .filter((period) => period !== -1),
    lifecycle: optLifecycle.unwrapOr(null),
    paraInfo: optInfo.unwrapOr(null),
    pendingAvail: optPending?.isSome ? optPending.unwrapOr(null) : null,
    qDmp: dmp.length,
    qHrmpE: hrmpE.length,
    qHrmpI: hrmpI.length,
    qUmp: ump?.length ?? 0,
    updateAt: optUp.unwrapOr(null),
    watermark: optWm.unwrapOr(null)
  })
};

function useParaInfoImpl (id: ParaId): Result {
  const { api } = useApi();

  return useCallMulti<Result>([
    [api.query.paras.heads, id],
    [api.query.paras.futureCodeUpgrades, id],
    [api.query.paras.paraLifecycles, id],
    [(api.query.parasDmp || api.query.paraDmp || api.query.dmp)?.downwardMessageQueues, id],
    [(api.query.parasUmp || api.query.ump)?.relayDispatchQueues, id],
    [(api.query.parasHrmp || api.query.paraHrmp || api.query.hrmp)?.hrmpEgressChannelsIndex, id],
    [(api.query.parasHrmp || api.query.paraHrmp || api.query.hrmp)?.hrmpIngressChannelsIndex, id],
    [(api.query.parasHrmp || api.query.paraHrmp || api.query.hrmp)?.hrmpWatermarks, id],
    [(api.query.parasInclusion || api.query.paraInclusion || api.query.inclusion)?.pendingAvailability, id],
    [api.query.registrar.paras, id],
    [api.query.slots.leases, id]
  ], MULTI_OPTS);
}

export default createNamedHook('useParaInfo', useParaInfoImpl);
