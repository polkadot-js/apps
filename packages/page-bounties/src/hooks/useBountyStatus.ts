// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';

import { getBountyStatus } from '@polkadot/app-bounties/helpers';
import { BountyStatusType } from '@polkadot/app-bounties/types';
import { BountyStatus } from '@polkadot/types/interfaces';

export function useBountyStatus (status: BountyStatus): BountyStatusType {
  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  return updateStatus();
}
