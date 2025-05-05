// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletStakingSlashingSlashingSpans } from '@polkadot/types/lookup';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_SPAN = {
  transform: (optSpans: Option<PalletStakingSlashingSlashingSpans>): number =>
    optSpans.isNone
      ? 0
      : optSpans.unwrap().prior.length + 1
};

function useSlashingSpansImpl (stashId: string): number {
  const { api } = useApi();

  return useCall<number>(api.query.staking.slashingSpans, [stashId], OPT_SPAN) || 0;
}

export default createNamedHook('useSlashingSpans', useSlashingSpansImpl);
