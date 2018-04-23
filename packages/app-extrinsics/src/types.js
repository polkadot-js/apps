// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { RxApiInterface } from '@polkadot/rx-api/types';

export type BaseProps = {
  className?: string,
  style?: {
    [string]: string
  }
};

export type BaseContext = {
  api: RxApiInterface
};

export type QueueTx = {
  message: Uint8Array,
  method: string,
  publicKey: Uint8Array
};
