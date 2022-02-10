// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Call } from '@polkadot/types/interfaces';

export interface DecodedExtrinsic {
  call: Call;
  fn: SubmittableExtrinsicFunction<'promise'>;
}
