// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { DerivedStakingOnlineStatus, DerivedHeartbeats } from '@polkadot/api-derive/types';

export function updateOnlineStatus (recentlyOnline: DerivedHeartbeats = {}): (sessionIds: AccountId[] | null, onlineStatus: DerivedStakingOnlineStatus) => DerivedStakingOnlineStatus {
  return (sessionIds: AccountId[] | null, onlineStatus: DerivedStakingOnlineStatus): DerivedStakingOnlineStatus => {
    if (!recentlyOnline || !sessionIds) {
      return onlineStatus;
    }

    const available = Object.keys(recentlyOnline);
    const sessionId = sessionIds.find((sessionId): boolean => available.includes(sessionId.toString()));

    return {
      ...onlineStatus,
      ...(
        sessionId
          ? {
            online: {
              isOnline: recentlyOnline[sessionId.toString()]
            }
          }
          : {}
      )
    };
  };
}
