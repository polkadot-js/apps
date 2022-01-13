// Copyright 2017-2022 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { charlieSigner, daveSigner, eveSigner, ferdieSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';
import { Hash } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';

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
  await execute(api.tx.balances.transfer(TREASURY_ADDRESS, new BN('50000000000000000')), signer);
}

export async function proposeMotion (api: ApiPromise, submittableExtrinsic: SubmittableExtrinsic<'promise'>, signer: KeyringPair): Promise<void> {
  await execute(api.tx.council.propose(4, submittableExtrinsic, LENGTH_BOUND), signer);
}

export async function getMotion (api: ApiPromise, index: number): Promise<DeriveCollectiveProposal> {
  const bounties = await api.derive.bounties.bounties();
  const bountyProposals = bounties.find((bounty) => (bounty.index.toNumber() === index))?.proposals as DeriveCollectiveProposal[];

  return bountyProposals[0];
}

export async function multiProposeMotion (api: ApiPromise, submittableExtrinsicArray: SubmittableExtrinsic<'promise'>[], signer: KeyringPair): Promise<void> {
  const proposeExtrinsicArray =
    submittableExtrinsicArray.map((extrinsic) =>
      api.tx.council.propose(4, extrinsic, LENGTH_BOUND));

  await execute(api.tx.utility.batch(proposeExtrinsicArray), signer);
}

export async function multiGetMotion (api: ApiPromise, indexes: number[]): Promise<DeriveCollectiveProposal[]> {
  const bounties = await api.derive.bounties.bounties();
  const bountyProposals =
    indexes.map((index) =>
      bounties.find((bounty) =>
        (bounty.index.toNumber() === index))?.proposals as DeriveCollectiveProposal[]);

  return bountyProposals.map((arr) => arr[0]);
}

async function multiVoteAye (acceptMotionSigners: KeyringPair[], api: ApiPromise, indexes: number[], hashes: Hash[]) {
  await Promise.all(
    acceptMotionSigners.map((signer) =>
      execute(
        api.tx.utility.batch(
          indexes.map((bountyIndex, i) => api.tx.council.vote(hashes[i], bountyIndex, true))
        ),
        signer
      )
    )
  );
}

async function multiCloseMotion (api: ApiPromise, indexes: number[], hashes: Hash[]) {
  await execute(
    api.tx.utility.batch(
      indexes.map((bountyIndex, i) => api.tx.council.close(hashes[i], bountyIndex, WEIGHT_BOUND, LENGTH_BOUND))),
    charlieSigner()
  );
}

export async function multiAcceptMotion (api: ApiPromise, hashes: Hash[], indexes: number[]): Promise<void> {
  const acceptMotionSigners = [charlieSigner(), daveSigner(), eveSigner(), ferdieSigner()];

  await multiVoteAye(acceptMotionSigners, api, indexes, hashes);
  await multiCloseMotion(api, indexes, hashes);
}

export function extractIndexesFromProposals (bountyProposals: DeriveCollectiveProposal[]): number[] {
  return bountyProposals.map((proposal) => proposal.votes?.index.toNumber() ?? 0);
}

export function extractHashesFromProposals (bountyProposals: DeriveCollectiveProposal[]): Hash[] {
  return bountyProposals.map((proposal) => proposal.hash);
}
