// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import bifrost from './bifrost';
import canvas from './canvas';
import centrifugeChain from './centrifuge-chain';
import crab from './crab';
import crust from './crust';
import testPara from './cumulus-test-parachain';
import darwinia from './darwinia';
import darwiniaParachain from './darwinia-parachain';
import dock from './dock';
import dusty from './dusty';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import encointerPara from './encointer-para';
import equilibrium from './equilibrium';
import galois from './galois';
import hanonycash from './hanonycash';
import jupiter from './jupiter';
import kilt from './kilt';
import nodle from './nodle';
import phala from './phala';
import plasm from './plasm';
import plasmParachain from './plasm-parachain';
import polkadex from './polkadex';
import robonomics from './robonomics';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subsocial from './subsocial';
import zero from './zero';

// mapping from specName in state.getRuntimeVersion
export default {
  Crab: crab,
  Darwinia: darwinia,
  Equilibrium: equilibrium,
  bifrost: bifrost,
  canvas,
  'centrifuge-chain': centrifugeChain,
  crust,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  'dock-main-runtime': dock,
  'dock-testnet': dock,
  dusty3: dusty,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  'encointer-parachain': encointerPara,
  galois: galois,
  hanonycash,
  jupiter,
  'mashnet-node': kilt,
  'node-polkadex': polkadex,
  'nodle-chain': nodle,
  'phala-node': phala,
  plasm,
  'plasm-parachain': plasmParachain,
  robonomics,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  stafi,
  subsocial,
  subzero: zero
};
