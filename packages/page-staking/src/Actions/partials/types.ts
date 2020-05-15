// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

export interface BondInfo {
  bondOwnTx?: SubmittableExtrinsic<'promise'> | null;
  bondTx?: SubmittableExtrinsic<'promise'> | null;
  controllerId?: string | null;
  controllerTx?: SubmittableExtrinsic<'promise'> | null;
  stashId?: string | null;
}

export interface NominateInfo {
  nominateTx?: SubmittableExtrinsic<'promise'> | null;
}

export interface SessionInfo {
  sessionTx?: SubmittableExtrinsic<'promise'> | null;
}

export interface ValidateInfo {
  validateTx?: SubmittableExtrinsic<'promise'> | null;
}
