// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { aliceSigner, bobSigner, charlieSigner, daveSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';

import { LENGTH_BOUND, TREASURY_ADDRESS, WEIGHT_BOUND } from './constants';

export async function acceptCurator (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.acceptCurator(id), aliceSigner());
}

export async function acceptMotion (api: ApiPromise, hash: Hash, index: number) {
  const bobVote = execute(api.tx.council.vote(hash, index, true), bobSigner());
  const charlieVote = execute(api.tx.council.vote(hash, index, true), charlieSigner());
  const daveVote = execute(api.tx.council.vote(hash, index, true), daveSigner());

  await Promise.all([bobVote, charlieVote, daveVote]);
  await execute(api.tx.council.close(hash, index, WEIGHT_BOUND, LENGTH_BOUND), charlieSigner());
}

export async function awardBounty (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.awardBounty(id, daveSigner().address), aliceSigner());
}

export async function claimBounty (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.claimBounty(id), daveSigner());
}

export async function proposeBounty (api: ApiPromise, value: BN, title: string) {
  await execute(api.tx.bounties.proposeBounty(value, title), aliceSigner());
}

export async function proposeMotion (api: ApiPromise, submittableExtrinsic: SubmittableExtrinsic<'promise'>) {
  await execute(api.tx.council.propose(4, submittableExtrinsic, LENGTH_BOUND), aliceSigner());
}

export async function fillTreasury (api: ApiPromise) {
  await execute(api.tx.balances.transfer(TREASURY_ADDRESS, new BN(5_000_000_000_000_000)), aliceSigner());
}
