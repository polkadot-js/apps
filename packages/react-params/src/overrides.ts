// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentMap } from './types.js';

import BalanceParam from './Param/Balance.js';

export const balanceCalls = [
  'auctions.bid',
  'balances.forceTransfer', 'balances.forceUnreserve', 'balances.setBalance', 'balances.transfer', 'balances.transferAllowDeath', 'balances.transferKeepAlive',
  'bounties.proposeBounty', 'bounties.proposeCurator',
  'childBounties.addChildBounty', 'childBounties.proposeCurator',
  'claims.mintClaim',
  'convictionVoting.delegate', 'convictionVoting.vote',
  'crowdloan.contribute', 'crowdloan.create', 'crowdloan.edit',
  'democracy.delegate', 'democracy.propose', 'democracy.vote',
  'identity.requestJudgement', 'identity.setFee',
  'nominationPools.bondExtra', 'nominationPools.create', 'nominationPools.createWithPoolId', 'nominationPools.join', 'nominationPools.unbond',
  'phragmenElection.vote',
  'society.bid', 'society.vouch',
  'staking.bond', 'staking.bondExtra', 'staking.rebond', 'staking.unbond',
  'tips.tip', 'tips.tipNew',
  'treasury.proposeSpend', 'treasury.spendLocal',
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
  'nominationPools.Bonded', 'nominationPools.PaidOut', 'nominationPools.PoolSlashed', 'nominationPools.Unbonded', 'nominationPools.UnbondingPoolSlashed',
  'referenda.DecisionDepositPlaced', 'referenda.DecisionDepositRefunded', 'referenda.DepositSlashed', 'referenda.SubmissionDepositRefunded',
  'staking.Bonded', 'staking.Rewarded', 'staking.Unbonded', 'staking.Withdrawn',
  'transactionPayment.TransactionFeePaid',
  'treasury.Deposit'
];

export const balanceCallsOverrides: ComponentMap = {
  'Compact<u128>': BalanceParam,
  u128: BalanceParam
};

export const balanceEventsOverrides = balanceCallsOverrides;
