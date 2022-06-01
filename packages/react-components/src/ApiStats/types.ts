// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProviderStats } from '@polkadot/rpc-provider/types';

export interface StatsExtended extends ProviderStats {
  max: {
    requests: number;
    subscriptions: number;
  };
}

export interface Stats {
  stats: StatsExtended;
  when: number;
}
