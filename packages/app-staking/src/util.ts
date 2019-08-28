/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';

export function updateOnlineStatus (recentlyOnline?: Record<string, BlockNumber>): (sessionIds: AccountId[] | null, onlineStatus: DerivedStakingOnlineStatus) => DerivedStakingOnlineStatus {
  return (sessionIds: AccountId[] | null, onlineStatus: DerivedStakingOnlineStatus): DerivedStakingOnlineStatus => {
    if (!recentlyOnline || !sessionIds) {
      return onlineStatus;
    }

    const sessionId: AccountId | undefined = sessionIds.find((accountId): boolean => Object.keys(recentlyOnline).includes(accountId.toString()));

    return {
      ...onlineStatus,
      ...(
        sessionId
          ? {
            online: {
              blockNumber: recentlyOnline[sessionId.toString()],
              isOnline: true
            }
          }
          : {}
      )
    };
  };
}
