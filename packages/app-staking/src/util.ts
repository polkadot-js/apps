/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';

export function updateOnlineStatus (recentlyOnline?: Record<string, BlockNumber>): (accountId: AccountId | string | null, onlineStatus: DerivedStakingOnlineStatus) => DerivedStakingOnlineStatus {
  return (accountId: AccountId | string | null, onlineStatus: DerivedStakingOnlineStatus): DerivedStakingOnlineStatus => {
    if (!recentlyOnline || !accountId) {
      return onlineStatus;
    }

    return {
      ...onlineStatus,
      ...(
        accountId && recentlyOnline[accountId.toString()]
          ? {
            online: {
              blockNumber: recentlyOnline[accountId.toString()],
              isOnline: true
            }
          }
          : {}
      )
    };
  };
}
