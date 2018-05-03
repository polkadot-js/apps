// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$TypeArray } from '@polkadot/primitives/param';
import type { Component, ComponentMap } from './types';

const Account = require('./Param/Account');
const Amount = require('./Param/Amount');
const Bool = require('./Param/Bool');
const Bytes = require('./Param/Bytes');
const Hash = require('./Param/Hash');
const Unknown = require('./Param/Unknown');
const VoteThreshold = require('./Param/VoteThreshold');
const Wasm = require('./Param/Wasm');

const components: ComponentMap = {
  'AccountId': Account,
  'Balance': Amount,
  'BlockNumber': Amount,
  'bool': Bool,
  'Bytes': Bytes,
  'Digest': Bytes,
  'Hash': Hash,
  'Timestamp': Amount,
  'u32': Amount,
  'u64': Amount,
  'VoteThreshold': VoteThreshold,
  'Wasm': Wasm
};

module.exports = function findComponent (type: Param$Type | Param$TypeArray, overrides?: ComponentMap = {}): Component | Array<Component> {
  if (Array.isArray(type)) {
    return type.map(findComponent);
  }

  return overrides[type] || components[type] || Unknown;
};
