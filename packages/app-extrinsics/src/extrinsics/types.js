// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type Extrinsic$Type = 'AccountId' | 'Balance' | 'BlockNumber' | 'Bytes' | 'Proposal' | 'u32' | 'u64';

export type Extrinsic$Param = {
  name: string,
  options?: {
    initValue?: mixed,
    minValue?: mixed,
    maxValue?: mixed
  },
  type: Extrinsic$Type
};

export type Extrinsic$Params = Array<Extrinsic$Param>;

export type ExtrinsicBasic = {
  description: string,
  index: number,
  isPrivate?: boolean,
  name: string,
  params: Extrinsic$Params
}

export type ExtrinsicsBasic = {
  description: string,
  methods: {
    private: Array<ExtrinsicBasic>,
    public: Array<ExtrinsicBasic>
  }
}

export type Extrinsic = {
  description: string,
  index: Uint8Array,
  isPrivate: boolean,
  name: string,
  params: Extrinsic$Params
};

export type ExtrinsicSection = {
  description: string,
  hasPrivate: boolean,
  hasPublic: boolean,
  index: Uint8Array,
  methods: Array<Extrinsic>,
  name: string
};

export type Extrinsics = {
  sections: Array<ExtrinsicSection>,
  get: (sectionMethod: string) => Extrinsic
}

export type ExtrinsicsMap = {
  [string]: Extrinsic
};
