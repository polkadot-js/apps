// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import acala from './acala';
import centrifugeChain from './centrifuge-chain';
import crab from './crab';
import crust from './crust';
import darwiniaParachain from './darwinia-parachain';
import testPara from './cumulus-test-parachain';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import equilibrium from './equilibrium';
import kilt from './kilt';
import kulupu from './kulupu';
import laminar from './laminar';
import nodeTemplate from './node-template';
import nodle from './nodle';
import plasm from './plasm';
import robonomics from './robonomics';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subsocial from './subsocial';

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
  kulupu,
  laminar,
  'mashnet-node': kilt,
  'node-template': nodeTemplate,
  'nodle-chain': nodle,
  plasm,
  robonomics,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  stafi,
  subsocial
};
