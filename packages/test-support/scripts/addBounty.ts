// Copyright 2017-2020 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Hash } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api';
import { createApi } from '@polkadot/test-support/api';
import { aliceSigner, bobSigner, charlieSigner, daveSigner } from '@polkadot/test-support/keyring';
import { execute } from '@polkadot/test-support/transaction';
import { sleep } from '@polkadot/test-support/utils/waitFor';

const TREASURY_ADDRESS = '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';
const FUNDING_TIME = 60000;
const PAYOUT_TIME = 60000;
const WEIGHT_BOUND = new BN('10000000000');
const LENGTH_BOUND = 100000;

async function acceptMotion (api: ApiPromise, hash: Hash, index: number) {
  await execute(api.tx.council.vote(hash, index, true), bobSigner());
  await execute(api.tx.council.vote(hash, index, true), charlieSigner());
  await execute(api.tx.council.vote(hash, index, true), daveSigner());

  await execute(api.tx.council.close(hash, index, WEIGHT_BOUND, LENGTH_BOUND), charlieSigner());
}

async function proposeBounty (api: ApiPromise, value: BN, title: string) {
  await execute(api.tx.bounties.proposeBounty(value, title), aliceSigner());
}

async function proposeMotion (api: ApiPromise, submittableExtrinsic: SubmittableExtrinsic<'promise'>) {
  await execute(api.tx.council.propose(4, submittableExtrinsic, LENGTH_BOUND), aliceSigner());
}

async function acceptCurator (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.acceptCurator(id), aliceSigner());
}

async function awardBounty (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.awardBounty(id, daveSigner().address), aliceSigner());
}

async function claimBounty (api: ApiPromise, id: number) {
  await execute(api.tx.bounties.claimBounty(id), daveSigner());
}

async function addBounty () {
  const api = await createApi(9944);

  await proposeBounty(api, new BN(500_000_000_000_000), 'new bounty hello hello more bytes');

  await proposeMotion(api, api.tx.bounties.approveBounty(0));

  let hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], 0);

  await execute(api.tx.balances.transfer(TREASURY_ADDRESS, new BN(5_000_000_000_000_000)), aliceSigner());
  console.log('Waiting for funding');
  await sleep(FUNDING_TIME);

  await proposeMotion(api, api.tx.bounties.proposeCurator(0, aliceSigner().address, 10));

  hashes = await api.query.council.proposals();

  await acceptMotion(api, hashes[0], 1);

  await acceptCurator(api, 0);

  await awardBounty(api, 0);

  await sleep(PAYOUT_TIME);
  await claimBounty(api, 0);
  process.exit(0);
}

addBounty().catch(console.error);
