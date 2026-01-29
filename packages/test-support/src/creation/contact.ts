// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { UseAccountInfo } from '@polkadot/react-hooks/types';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { AccountOverrides as ContactOverrides, Override } from '../types.js';

export const aContact = (): ContactOverrides => ({});

export const aContactWithBalance = (balance: Override<DeriveBalancesAll>): ContactOverrides => ({
  balance
});

export const aContactWithInfo = (info: Override<UseAccountInfo>): ContactOverrides => ({
  info
});

export const aContactWithStaking = (staking: Override<DeriveStakingAccount>): ContactOverrides => ({
  staking
});

export const aContactWithMeta = (meta: Override<KeyringJson$Meta>): ContactOverrides => ({
  meta
});
