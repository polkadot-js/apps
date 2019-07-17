// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

export interface GeneratorCalculation {
  count: number;
  offset: number;
}

export interface GeneratorMatch extends GeneratorCalculation {
  address: string;
  mnemonic?: string;
  seed: Uint8Array;
}

export type GeneratorMatches = GeneratorMatch[];

export interface GeneratorOptions {
  atOffset?: number;
  match: string;
  network?: string;
  runs: number;
  type: KeypairType;
  withCase?: boolean;
  withHex?: boolean;
}

export interface GeneratorResult {
  elapsed: number;
  found: GeneratorMatches;
}
