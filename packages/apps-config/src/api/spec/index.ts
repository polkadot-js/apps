// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import acala from './acala';
import centrifugeChain from './centrifuge-chain';
import crab from './crab';
import crust from './crust';
import darwiniaParachain from './darwinia-parachain';
import testPara from './cumulus-test-parachain';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import kilt from './kilt';
import kulupu from './kulupu';
import laminar from './laminar';
import nodeTemplate from './node-template';
import nodle from './nodle';
import plasm from './plasm';
import robonomics from './robonomics';
import stablePoc from './stable-poc';
import stafi from './stafi';
import subsocialNode from './subsocial';
import dock from './dock';

export default {
  Crab: crab,
  acala,
  'centrifuge-chain': centrifugeChain,
  crust,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  'dock-testnet': dock,
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
  subsocial: subsocialNode
};
