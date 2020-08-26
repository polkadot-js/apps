// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import canvas from './canvas';
import centrifugeChain from './centrifuge-chain';
import crab from './crab';
import crust from './crust';
import darwiniaParachain from './darwinia-parachain';
import dock from './dock';
import testPara from './cumulus-test-parachain';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import equilibrium from './equilibrium';
import hanonycash from './hanonycash';
import kilt from './kilt';
import kulupu from './kulupu';
import laminar from './laminar';
import moonbeam from './moonbeam';
import nodeTemplate from './node-template';
import nodle from './nodle';
import plasm from './plasm';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subsocialNode from './subsocial';

// mapping from specName in state.getRuntimeVersion
export default {
  Crab: crab,
  Equilibrium: equilibrium,
  acala,
  'centrifuge-chain': centrifugeChain,
  crust,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  dusty3: plasm,
  edgeware,
  'encointer-node': encointerNodeNotee,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  hanonycash,
  kulupu,
  'mashnet-node': kilt,
  'node-moonbeam': moonbeam,
  'node-template': nodeTemplate,
  'nodle-chain': nodle,
  plasm,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  stafi,
  subsocial: subsocialNode
};
