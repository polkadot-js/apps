// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { decorateMethod } from '@polkadot/api/promise';
import { AnyJson } from '@polkadot/types/types';

import InkAbi from '../InkAbi';
import Code from '../base/Code';

export default class PromiseCode extends Code<'promise'> {
  constructor (api: ApiPromise, abi: AnyJson | InkAbi, wasm: string | Uint8Array) {
    super(api, abi, decorateMethod, wasm);
  }
}
