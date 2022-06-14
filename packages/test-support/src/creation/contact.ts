// Copyright 2017-2022 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { UseAccountInfo } from '@polkadot/react-hooks/types';
import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';

import { AccountOverrides as ContactOverrides, Override } from '../types';

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
