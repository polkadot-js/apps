// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Extrinsic } from '@polkadot/extrinsics/types';

export type BareProps = {
  className?: string,
  style?: {
    [string]: string
  }
};

export type BaseProps = BareProps & {
  t: I18Next$Translate
};

export type RawParam = {
  // flowlint-next-line unclear-type:off
  data?: any,
  isValid: boolean,
  value: mixed,
}

export type EncodedParams = {
  data: Uint8Array,
  extrinsic: Extrinsic,
  isValid: boolean
};

export type QueueTx$Status = 'incomplete' | 'cancelled' | 'error' | 'queued' | 'sent';

export type QueueTx = EncodedParams & {
  index: BN,
  publicKey: Uint8Array,
  status: QueueTx$Status
};
