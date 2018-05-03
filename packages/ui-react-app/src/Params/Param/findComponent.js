// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$TypeArray } from '@polkadot/primitives/param';
import type { ComponentMap } from '../types';

const Account = require('./Account');
const Amount = require('./Amount');
const Bool = require('./Bool');
const Bytes = require('./Bytes');
const Hash = require('./Hash');
const Unknown = require('./Unknown');
const VoteThreshold = require('./VoteThreshold');
const Wasm = require('./Wasm');

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

module.exports = function findComponent (type: Param$Type | Param$TypeArray, overrides?: ComponentMap = {}): React$ComponentType<*> | Array<React$ComponentType<*>> {
  if (Array.isArray(type)) {
    return type.map((type) =>
      findComponent(type, overrides)
    );
  }

  return overrides[type] || components[type] || Unknown;
};
