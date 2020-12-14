// Copyright 2017-2020 @polkadot/apps-config authors & contributors
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
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import equilibrium from './equilibrium';
import galois from './galois';
import hanonycash from './hanonycash';
import kilt from './kilt';
import kulupu from './kulupu';
import nodeTemplate from './node-template';
import nodle from './nodle';
import phala from './phala';
import plasm from './plasm';
import robonomics from './robonomics';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subsocial from './subsocial';

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
  edgeware,
  'encointer-node': encointerNodeNotee,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  galois: galois,
  hanonycash,
  kulupu,
  'mashnet-node': kilt,
  'node-template': nodeTemplate,
  'nodle-chain': nodle,
  'phala-node': phala,
  plasm,
  robonomics,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  stafi,
  subsocial
};
