// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

export type BlockHeader = {
  hash: Uint8Array,
  header: Header
};

export type BlockHeaders = Array<BlockHeader>;
