// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Extrinsic$Type = 'AccountId' | 'Balance' | 'BlockNumber';

export type Extrinsic$Params = Array<Extrinsic$Type>;

export type ExtrinsicBasic = {
  description: string,
  params: Extrinsic$Params
}

export type Extrinsic = ExtrinsicBasic & {
  index: Uint8Array,
  indexHex: string,
  name: string
};

export type Extrinsics = {
  [string]: Extrinsic
}

export type ExtrinsicsBasic = {
  [string]: ExtrinsicBasic
}
