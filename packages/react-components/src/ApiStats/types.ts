// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProviderStats } from '@polkadot/rpc-provider/types';

export interface Stats {
  stats: ProviderStats;
  when: number;
}
