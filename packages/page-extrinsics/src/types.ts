// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

export interface DecodedExtrinsic {
  call: Call;
  hex: HexString;
  fn: SubmittableExtrinsicFunction<'promise'>;
}
