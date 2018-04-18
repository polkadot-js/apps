// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Call$Type = 'AccountId' | 'Balance' | 'BlockNumber';

export type Call$Params = Array<Call$Type>;

export type Call = {
  description: string,
  index: Uint8Array,
  params: Call$Params
};

export type Calls = {
  [string]: $Shape<Call>
}
