// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Extrinsic$TypeName = 'AccountId' | 'Balance' | 'BlockNumber' | 'bool' | 'Bytes' | 'Hash' | 'MisbehaviorReport' | 'Proposal' | 'SessionKey' | 'u32' | 'u64' | 'VoteThreshold' | 'Wasm';

export type Extrinsic$Type =
  Extrinsic$TypeName |
  ['Array', Extrinsic$TypeName];

export type Extrinsic$Param = {
  options?: {
    initValue?: mixed,
    minValue?: mixed,
    maxValue?: mixed
  },
  type: Extrinsic$Type
};

export type Extrinsic$Params = {
  [string]: Extrinsic$Param
};

export type ExtrinsicBase = {
  description: string,
  index: number,
  params: Extrinsic$Params
}

export type ExtrinsicSectionName = 'consensus' | 'council' | 'councilVoting' | 'democracy' | 'session' | 'staking';

export type ExtrinsicsBaseMethods$Map = {
  [string]: ExtrinsicBase
};

export type ExtrinsicsBaseMethods = {
  private: ExtrinsicsBaseMethods$Map,
  public: ExtrinsicsBaseMethods$Map
};

export type ExtrinsicsBaseSection = {
  description: string,
  methods: ExtrinsicsBaseMethods
}

export type ExtrinsicsBaseMap = {
  [ExtrinsicSectionName]: ExtrinsicsBaseSection
};

export type Extrinsic = {
  description: string,
  index: Uint8Array,
  name: string,
  params: Extrinsic$Params
};

export type ExtrinsicMethods$Map = {
  [string]: Extrinsic
};

export type ExtrinsicMethods = {
  private: ExtrinsicMethods$Map,
  public: ExtrinsicMethods$Map
};

export type ExtrinsicSection = {
  description: string,
  index: Uint8Array,
  methods: ExtrinsicMethods,
  name: ExtrinsicSectionName
};

export type Extrinsics = {
  [ExtrinsicSectionName]: Extrinsic
};
