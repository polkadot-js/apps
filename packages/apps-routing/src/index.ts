// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types.js';

<<<<<<< HEAD
import accounts from './accounts.js';
import addresses from './addresses.js';
import alliance from './alliance.js';
import assets from './assets.js';
import bounties from './bounties.js';
import calendar from './calendar.js';
import claims from './claims.js';
import collator from './collator.js';
import contracts from './contracts.js';
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
import staking2 from './staking2.js';
import storage from './storage.js';
import sudo from './sudo.js';
import techcomm from './techcomm.js';
import teleport from './teleport.js';
import transfer from './transfer.js';
import treasury from './treasury.js';
import utilities from './utilities.js';
import whitelist from './whitelist.js';
=======
import accounts from './accounts';
import addresses from './addresses';
import alliance from './alliance';
import assets from './assets';
import bounties from './bounties';
import calendar from './calendar';
import claims from './claims';
import collator from './collator';
import contracts from './contracts';
import council from './council';
import ddelegation from './ddelegation';
import democracy from './democracy';
import explorer from './explorer';
import extrinsics from './extrinsics';
import fellowship from './fellowship';
import files from './files';
import gilt from './gilt';
import js from './js';
import membership from './membership';
import nfts from './nfts';
import parachains from './parachains';
import poll from './poll';
import preimages from './preimages';
import ranked from './ranked';
import referenda from './referenda';
import rpc from './rpc';
import runtime from './runtime';
import scheduler from './scheduler';
import settings from './settings';
import signing from './signing';
import society from './society';
import staking from './staking';
import storage from './storage';
import sudo from './sudo';
import techcomm from './techcomm';
import teleport from './teleport';
import transfer from './transfer';
import treasury from './treasury';
import utilities from './utilities';
import whitelist from './whitelist';
>>>>>>> bd1fc43151 (lint & types fixed)

export default function create (t: TFunction): Routes {
  return [
    accounts(t),
    addresses(t),
    explorer(t),
    claims(t),
    poll(t),
    transfer(t),
    teleport(t),
    staking(t),
    staking2(t),
    collator(t),
    // governance v2
    referenda(t),
    membership(t),
    alliance(t),
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
    gilt(t),
    assets(t),
    nfts(t),
    society(t),
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
