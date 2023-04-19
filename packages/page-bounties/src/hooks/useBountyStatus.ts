// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyStatus } from '@polkadot/types/interfaces';
import type { BountyStatusType } from '../types.js';

import { useCallback } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import { getBountyStatus } from '../helpers/index.js';

function useBountyStatusImpl (status: BountyStatus): BountyStatusType {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  return updateStatus();
}

export const useBountyStatus = createNamedHook('useBountyStatus', useBountyStatusImpl);
