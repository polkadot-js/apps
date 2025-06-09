// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Routes, TFunction } from './types.js';

import accounts from './accounts.js';
import addresses from './addresses.js';
import alliance from './alliance.js';
import ambassador from './ambassador.js';
import assets from './assets.js';
import bounties from './bounties.js';
import broker from './broker.js';
import calendar from './calendar.js';
import claims from './claims.js';
import collator from './collator.js';
import contracts from './contracts.js';
import coretime from './coretime.js';
import council from './council.js';
import democracy from './democracy.js';
import explorer from './explorer.js';
import extrinsics from './extrinsics.js';
import fellowship from './fellowship.js';
import files from './files.js';
import gilt from './gilt.js';
import js from './js.js';
import membership from './membership.js';
import nfts from './nfts.js';
import nis from './nis.js';
import parachains from './parachains.js';
import poll from './poll.js';
import preimages from './preimages.js';
import ranked from './ranked.js';
import referenda from './referenda.js';
import rpc from './rpc.js';
import runtime from './runtime.js';
import scheduler from './scheduler.js';
import settings from './settings.js';
import signing from './signing.js';
import society from './society.js';
import staking from './staking.js';
import stakingAsync from './staking-async.js';
import staking2 from './staking2.js';
import stakingLegacy from './stakingLegacy.js';
import storage from './storage.js';
import sudo from './sudo.js';
import techcomm from './techcomm.js';
import teleport from './teleport.js';
import transfer from './transfer.js';
import treasury from './treasury.js';
import utilities from './utilities.js';
import whitelist from './whitelist.js';

export default function create (t: TFunction): Routes {
  return [
    accounts(t),
    addresses(t),
    explorer(t),
    claims(t),
    poll(t),
    transfer(t),
    teleport(t),
    // Staking for AssetHub Migration
    stakingAsync(t),
    staking(t),
    staking2(t),
    // Legacy staking Pre v14 pallet version.
    stakingLegacy(t),
    collator(t),
    // Coretime
    broker(t),
    coretime(t),
    // governance v2
    referenda(t),
    membership(t),
    alliance(t),
    ambassador(t),
    fellowship(t),
    ranked(t),
    preimages(t),
    whitelist(t),
    // old v1 governance
    democracy(t),
    council(t),
    techcomm(t),
    // other governance-related
    treasury(t),
    bounties(t),
    // others
    parachains(t),
    assets(t),
    nfts(t),
    society(t),
    nis(t),
    gilt(t),
    scheduler(t),
    calendar(t),
    contracts(t),
    storage(t),
    extrinsics(t),
    rpc(t),
    runtime(t),
    signing(t),
    sudo(t),
    files(t),
    js(t),
    utilities(t),
    settings(t)
  ];
}
