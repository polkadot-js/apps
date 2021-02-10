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

// mapping from specName in state.getRuntimeVersion
export default {
  Crab: crab,
  Darwinia: darwinia,
  'ares-parachain': aresParachain,
  bifrost,
  'bitcountry-node': bitcountry,
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
};
