// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { AccountOverrides, Override } from '../types.js';

export const anAccount = (): AccountOverrides => ({});

export const anAccountWithBalance = (balance: Override<DeriveBalancesAll>): AccountOverrides => ({
  balance
});

export const anAccountWithInfo = (info: Override<UseAccountInfo>): AccountOverrides => ({
  info
});

export const anAccountWithMeta = (meta: Override<KeyringJson$Meta>): AccountOverrides => ({
  meta
});

export const anAccountWithStaking = (staking: Override<DeriveStakingAccount>): AccountOverrides => ({
  staking
});

export const anAccountWithBalanceAndMeta = (balance: Override<DeriveBalancesAll>, meta: Override<KeyringJson$Meta>): AccountOverrides => ({
  balance,
  meta
});

export const anAccountWithInfoAndMeta = (info: Override<UseAccountInfo>, meta: Override<KeyringJson$Meta>): AccountOverrides => ({
  info,
  meta
});
