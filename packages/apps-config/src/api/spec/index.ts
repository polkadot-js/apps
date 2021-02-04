// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
import dusty from './dusty';
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
import nodle from './nodle';
import phala from './phala';
import phalaParachain from './phala-parachain';
import plasm from './plasm';
import plasmParachain from './plasm-parachain';
import polkadex from './polkadex';
import robonomics from './robonomics';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subdao from './subdao';
import subsocial from './subsocial';
import ternoa from './ternoa';
import uniarts from './uniarts';
import zenlink from './zenlink';
import zero from './zero';

// mapping from specName in state.getRuntimeVersion
export default {
  Crab: crab,
  Darwinia: darwinia,
  Equilibrium: equilibrium,
  'ares-parachain': aresParachain,
  bifrost: bifrost,
  'bitcountry-node': bitcountry,
  canvas,
  'centrifuge-chain': centrifugeChain,
  chainx: chainx,
  clover,
  'clover-rococo': cloverRococo,
  crust,
  'crust-parachain': crustParachain,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  'datahighway-parachain': datahighwayParachain,
  'dock-main-runtime': dock,
  'dock-testnet': dock,
  dusty3: dusty,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  'encointer-parachain': encointerPara,
  'hack-hydra-dx': hydrate,
  hanonycash,
  idavoll: idavoll,
  'integritee-parachain': integritee,
  jupiter,
  'kilt-parachain': kilt,
  'mashnet-node': kilt,
  'node-polkadex': polkadex,
  'nodle-chain': nodle,
  'phala-collator': phalaParachain,
  'phala-node': phala,
  plasm,
  'plasm-parachain': plasmParachain,
  robonomics,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  stafi,
  subdao,
  subsocial,
  subzero: zero,
  ternoa: ternoa,
  uniarts: uniarts,
  zenlink
};
