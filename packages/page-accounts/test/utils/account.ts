// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { UseAccountInfo } from '@polkadot/react-hooks/types';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides, Override } from '../hooks/default';

export const anAccount = (): AccountOverrides => ({});

export const anAccountWithBalance = (balance: Override<DeriveBalancesAll>) => ({
  balance
});

export const anAccountWithBalanceAndMeta = (balance: Override<DeriveBalancesAll>, meta: Override<KeyringJson$Meta>) => ({
  balance,
  meta
});

export const anAccountWithInfo = (info: Override<UseAccountInfo>) => ({
  info
});

export const anAccountWithMeta = (meta: Override<KeyringJson$Meta>) => ({
  meta
});

export const anAccountWithStaking = (staking: Override<DeriveStakingAccount>) => ({
  staking
});
