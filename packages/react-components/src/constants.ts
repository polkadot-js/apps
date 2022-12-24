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
  'auctions.bid',
  'balances.forceTransfer', 'balances.forceUnreserve', 'balances.setBalance', 'balances.transfer', 'balances.transferKeepAlive',
  'bounties.proposeBounty', 'bounties.proposeCurator',
  'childBounties.proposeCurator',
  'claims.mintClaim',
  'convictionVoting.delegate', 'convictionVoting.vote',
  'crowdloan.contribute', 'crowdloan.create', 'crowdloan.edit',
  'democracy.delegate', 'democracy.propose', 'democracy.vote',
  'identity.requestJudgement', 'identity.setFee',
  'nominationPools.bondExtra', 'nominationPools.join', 'nominationPools.unbond',
  'phragmenElection.vote',
  'society.bid', 'society.vouch',
  'staking.bond', 'staking.bondExtra', 'staking.rebond', 'staking.unbond',
  'tips.tip', 'tips.tipNew',
  'treasury.proposeSpend', 'treasury.spend',
  'vesting.forceVestedTransfer', 'vesting.vestedTransfer'
];

// needs expansion with events from above
export const balanceEvents = [
  'auctions.BidAccepted', 'auctions.ReserveConfiscated', 'auctions.Reserved', 'auctions.Unreserved',
  'balances.Deposit', 'balances.DustLost', 'balances.Endowed', 'balances.Transfer', 'balances.Unreserved', 'balances.Withdraw',
  'bounties.BountyClaimed', 'bounties.BountyRejected',
  'claims.Claimed',
  'convictionVoting.Voted',
  'crowdloan.Contributed', 'crowdloan.Withdrew',
  'democracy.Voted',
  'staking.Bonded', 'staking.Rewarded', 'staking.Unbonded', 'staking.Withdrawn',
  'transactionPayment.TransactionFeePaid',
  'treasury.Deposit'
];

export const balanceCallsOverrides: ComponentMap = {
  'Compact<u128>': BalanceParam,
  u128: BalanceParam
};

export const balanceEventsOverrides = balanceCallsOverrides;
