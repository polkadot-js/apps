// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentMap } from '@polkadot/react-params/types';

import BalanceParam from '@polkadot/react-params/Param/Balance';

export const ScreenSizes = {
  DESKTOP: 992,
  PHONE: 576,
  TABLET: 768
};

export const rewardDestinationOptions = [
  { text: 'Stash account (increase the amount at stake)', value: 0 },
  { text: 'Stash account (do not increase the amount at stake)', value: 1 },
  { text: 'Controller account', value: 2 }
];

export const balanceCalls = [
  'balances.forceTransfer', 'balances.forceUnreserve', 'balances.setBalance', 'balances.transfer', 'balances.transferKeepAlive',
  'crowdloan.contribute', 'crowdloan.create', 'crowdloan.edit',
  'democracy.delegate', 'democracy.propose',
  'nominationPools.bondExtra', 'nominationPools.join', 'nominationPools.unbond',
  'staking.bond', 'staking.bondExtra', 'staking.rebond', 'staking.unbond',
  'treasury.proposeSpend', 'treasury.spend',
  'vesting.forceVestedTransfer', 'vesting.vestedTransfer'
];

export const balanceEvents = [
  'balances.Deposit', 'balances.Endowed', 'balances.Transfer', 'balances.Withdraw',
  'staking.Bonded', 'staking.Rewarded', 'staking.Unbonded', 'staking.Withdrawn',
  'transactionPayment.TransactionFeePaid',
  'treasury.Deposit'
];

export const balanceCallsOverrides: ComponentMap = {
  'Compact<u128>': BalanceParam
};

export const balanceEventsOverrides: ComponentMap = {
  u128: BalanceParam
};
