// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export type Override<T> = {
  [P in keyof T]?: T[P];
}

export interface AccountOverrides {
  meta?: Override<KeyringJson$Meta>;
  balance?: Override<DeriveBalancesAll>;
  staking?: Override<DeriveStakingAccount>;
  info?: Override<UseAccountInfo>;
}

export interface WaitOptions { interval?: number, timeout?: number }
