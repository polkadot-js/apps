// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Routes } from './types';

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
import settings from './settings';
import signing from './signing';
import masterSubmission from './master-proposals'
import anchor from './anchor'
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
    collator(t),
    democracy(t),
    referenda(t),
    council(t),
    treasury(t),
    bounties(t),
    techcomm(t),
    membership(t),
    alliance(t),
    fellowship(t),
    ranked(t),
    preimages(t),
    whitelist(t),
    parachains(t),
    gilt(t),
    assets(t),
    nfts(t),
    society(t),
    calendar(t),
    contracts(t),
    storage(t),
    extrinsics(t),
    masterSubmission(t),
    anchor(t),
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
