// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeypairType } from '@polkadot/util-crypto/types';

export interface Generator$Calculation {
  count: number;
  offset: number;
}

export interface Generator$Match extends Generator$Calculation {
  address: string;
  mnemonic?: string;
  seed: Uint8Array;
}

export type Generator$Matches = Generator$Match[];

export interface Generator$Options {
  atOffset?: number;
  match: string;
  runs: number;
  type: KeypairType;
  withCase?: boolean;
  withHex?: boolean;
}

export interface Generator$Result {
  elapsed: number;
  found: Generator$Matches;
}
