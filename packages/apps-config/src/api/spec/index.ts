// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import acala from './acala';
import centrifugeChain from './centrifuge-chain';
import crab from './crab';
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
import stablePoc from './stable-poc';
import subsocialNode from './subsocial';

export default {
  Crab: crab,
  acala,
  'centrifuge-chain': centrifugeChain,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  edgeware,
  'encointer-node': encointerNodeNotee,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  kulupu,
  laminar,
  'mashnet-node': kilt,
  'node-template': nodeTemplate,
  'nodle-chain': nodle,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  subsocial: subsocialNode
};
