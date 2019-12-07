// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type Param = any;

export type Params = [] | [Param] | [Param, Param] | [Param, Param, Param];

export interface Options <T> {
  defaultValue?: T;
  paramMap?: (params: any) => Params;
  transform?: (value: any) => T;
}
