// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { BountyStatusType } from '../types.js';

import { useCallback } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import { getBountyStatus } from '../helpers/index.js';

function useBountyStatusImpl (status: PalletBountiesBountyStatus): BountyStatusType {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  return updateStatus();
}

export const useBountyStatus = createNamedHook('useBountyStatus', useBountyStatusImpl);
