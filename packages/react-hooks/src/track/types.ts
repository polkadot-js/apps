// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type Arg = any;

export type Params = [] | [Arg] | [Arg, Arg] | [Arg, Arg, Arg];

export interface Options <T> {
  paramMap?: (params: any) => any;
  transform?: (value: any) => T;
}
