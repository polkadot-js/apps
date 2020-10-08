// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

import { ApiRx } from '@polkadot/api';
import { decorateMethod } from '@polkadot/api/rx';

import InkAbi from '../InkAbi';
import Blueprint from '../base/Blueprint';

export default class RxBlueprint extends Blueprint<'rxjs'> {
  constructor (api: ApiRx, abi: AnyJson | InkAbi, codeHash: string | Hash) {
    super(api, abi, decorateMethod, codeHash);
  }
}
