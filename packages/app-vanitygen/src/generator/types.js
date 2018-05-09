// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

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
