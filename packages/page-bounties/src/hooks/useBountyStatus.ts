// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyStatusType } from '@polkadot/app-bounties/types';

import { useCallback } from 'react';

import { getBountyStatus } from '@polkadot/app-bounties/helpers';
import { createNamedHook } from '@polkadot/react-hooks';
import { BountyStatus } from '@polkadot/types/interfaces';

function useBountyStatusImpl (status: BountyStatus): BountyStatusType {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  return updateStatus();
}

export const useBountyStatus = createNamedHook('useBountyStatus', useBountyStatusImpl);
