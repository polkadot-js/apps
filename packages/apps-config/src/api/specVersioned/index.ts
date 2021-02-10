// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import acala from './acala';
import dock from './dock';
import dotmog from './dotmog';
import dusty from './dusty';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import encointerPara from './encointer-para';
import equilibrium from './equilibrium';
import hanonycash from './hanonycash';
import hydrate from './hydrate';
import idavoll from './idavoll';
import integritee from './integritee';
import jupiter from './jupiter';
import kilt from './kilt';
import kulupu from './kulupu';
import laminar from './laminar';
import moonbeam from './moonbeam';
import nodle from './nodle';
import phala from './phala';
import phalaParachain from './phala-parachain';
import plasm from './plasm';
import plasmParachain from './plasm-parachain';
import polkabtc from './polkabtc';
import polkadex from './polkadex';
import robonomics from './robonomics';
import soraSubstrate from './soraSubstrate';
import stafi from './stafi';
import subdao from './subdao';
import subsocial from './subsocial';
import ternoa from './ternoa';
import trustbase from './trustbase';
import uniarts from './uniarts';
import zenlink from './zenlink';
import zero from './zero';

export default {
  Equilibrium: equilibrium,
  acala,
  'btc-parachain': polkabtc,
  'dock-main-runtime': dock,
  'dock-testnet': dock,
  'dotmog-node': dotmog,
  dusty3: dusty,
  edgeware,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  'encointer-parachain': encointerPara,
  'hack-hydra-dx': hydrate,
  hanonycash,
  'hydra-dx': hydrate,
  idavoll,
  'integritee-parachain': integritee,
  jupiter,
  'kilt-parachain': kilt,
  kulupu,
  laminar,
  mandala: acala,
  'mashnet-node': kilt,
  'moonbase-alphanet': moonbeam,
  moonbeam,
  'moonbeam-standalone': moonbeam,
  'node-moonbeam': moonbeam,
  'node-polkadex': polkadex,
  'nodle-chain': nodle,
  'phala-collator': phalaParachain,
  'phala-node': phala,
  plasm,
  'plasm-parachain': plasmParachain,
  robonomics,
  'sora-substrate': soraSubstrate,
  stafi,
  subdao,
  subsocial,
  subzero: zero,
  ternoa,
  trustbase,
  uniarts,
  zenlink
};
