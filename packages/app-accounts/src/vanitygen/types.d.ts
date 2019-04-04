// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type Generator$Calculation = {
  count: number,
  offset: number
};

export type Generator$Match = Generator$Calculation & {
  address: string,
  seed: Uint8Array
};

export type Generator$Matches = Array<Generator$Match>;

export type Generator$Options = {
  atOffset?: number,
  match: string,
  runs?: number,
  withCase?: boolean
};

export type Generator$Result = {
  elapsed: number,
  found: Generator$Matches
}
