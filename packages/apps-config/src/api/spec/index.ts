// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import acala from './acala';
import aresParachain from './ares-parachain';
import bifrost from './bifrost';
import bitcountry from './bitcountry';
import canvas from './canvas';
import centrifugeChain from './centrifuge-chain';
import chainx from './chainx';
import clover from './clover';
import cloverRococo from './clover-rococo';
import crab from './crab';
import crust from './crust';
import crustParachain from './crust-parachain';
import testPara from './cumulus-test-parachain';
import darwinia from './darwinia';
import darwiniaParachain from './darwinia-parachain';
import datahighwayParachain from './datahighway';
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
import litentry from './litentry';
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

// NOTE: The mapping is done from specName in state.getRuntimeVersion
const spec: Record<string, OverrideBundleDefinition> = {
  Crab: crab,
  Darwinia: darwinia,
  Equilibrium: equilibrium,
  acala,
  'ares-parachain': aresParachain,
  bifrost,
  'bitcountry-node': bitcountry,
  'btc-parachain': polkabtc,
  canvas,
  'centrifuge-chain': centrifugeChain,
  chainx,
  clover,
  'clover-rococo': cloverRococo,
  crust,
  'crust-parachain': crustParachain,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  'datahighway-parachain': datahighwayParachain,
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
  litentry,
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

export default spec;
