// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { charlieSigner,
  daveSigner,
  eveSigner,
  ferdieSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';
import { Hash } from '@polkadot/types/interfaces';

import { LENGTH_BOUND, TREASURY_ADDRESS, WEIGHT_BOUND } from './constants';

export async function acceptMotion (api: ApiPromise, hash: Hash, index: number): Promise<void> {
  const charlieVote = execute(api.tx.council.vote(hash, index, true), charlieSigner());
  const daveVote = execute(api.tx.council.vote(hash, index, true), daveSigner());
  const eveVote = execute(api.tx.council.vote(hash, index, true), eveSigner());
  const ferdieVote = execute(api.tx.council.vote(hash, index, true), ferdieSigner());

  await Promise.all([charlieVote, daveVote, eveVote, ferdieVote]);
  await execute(api.tx.council.close(hash, index, WEIGHT_BOUND, LENGTH_BOUND), charlieSigner());
}

export async function fillTreasury (api: ApiPromise, signer: KeyringPair): Promise<void> {
  await execute(api.tx.balances.transfer(TREASURY_ADDRESS, new BN(5_000_000_000_000_000)), signer);
}

export async function proposeMotion (api: ApiPromise, submittableExtrinsic: SubmittableExtrinsic<'promise'>, signer: KeyringPair): Promise<void> {
  await execute(api.tx.council.propose(4, submittableExtrinsic, LENGTH_BOUND), signer);
}

export async function getMotion (api: ApiPromise, index: number): Promise<DeriveCollectiveProposal> {
  const bounties = await api.derive.bounties.bounties();
  const bountyProposals = bounties.find((bounty) => (bounty.index.toNumber() === index))?.proposals as DeriveCollectiveProposal[];

  return bountyProposals[0];
}
