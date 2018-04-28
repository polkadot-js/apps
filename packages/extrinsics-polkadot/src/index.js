// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseMap } from '@polkadot/extrinsics/types';

const init = require('@polkadot/extrinsics');

const consensus = require('./consensus');
const council = require('./council');
const councilVoting = require('./councilVoting');
const democracy = require('./democracy');
const session = require('./session');
const staking = require('./staking');

const map: ExtrinsicsBaseMap = {
  consensus,
  council,
  councilVoting,
  democracy,
  session,
  staking
};

module.exports = init(map);
