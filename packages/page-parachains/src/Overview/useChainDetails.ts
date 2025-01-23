// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, Header, ParaId, RuntimeVersion } from '@polkadot/types/interfaces';

import { createNamedHook, useCall, useParaApi } from '@polkadot/react-hooks';

interface Result {
  bestNumber?: BlockNumber;
  runtimeVersion?: RuntimeVersion;
}

const HDR_OPTS = {
  transform: (header: Header) => header.number.unwrap()
};

function useChainDetailsImpl (id: ParaId): Result {
  const { api } = useParaApi(id);

  // We are not using the derive here, we keep this queries to the point to not overload
  return {
    bestNumber: useCall<BlockNumber>(api?.rpc.chain.subscribeNewHeads, undefined, HDR_OPTS),
    runtimeVersion: useCall<RuntimeVersion>(api?.rpc.state.subscribeRuntimeVersion)
  };
}

export default createNamedHook('useChainDetails', useChainDetailsImpl);
