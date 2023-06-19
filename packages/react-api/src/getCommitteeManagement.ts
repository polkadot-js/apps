// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ApiDecoration } from '@polkadot/api/types';

export const COMMITTEE_MANAGEMENT_NAMES = ['committeeManagement', 'elections'];

export default function getCommitteeManagement (api: ApiPromise | ApiDecoration<'promise'>) {
  return {
    consts: api.consts.committeeManagement || api.consts.elections,
    query: api.query.committeeManagement || api.query.elections
  };
}
