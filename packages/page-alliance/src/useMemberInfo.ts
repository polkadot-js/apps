// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { bool, Option, UInt } from '@polkadot/types';
import type { MemberInfo } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useMemberInfoImpl (accountId: string): MemberInfo | undefined {
  const { api } = useApi();
  const upForKicking = useCall<bool>(api.query.alliance.upForKicking, [accountId]);
  const depositOf = useCall<Option<UInt>>(api.query.alliance.depositOf, [accountId]);

  return useMemo(
    () => upForKicking && depositOf && {
      accountId,
      deposit: depositOf.unwrapOr(null),
      isUpForKicking: upForKicking.isTrue
    },
    [accountId, upForKicking, depositOf]
  );
}

export default createNamedHook('useMemberInfo', useMemberInfoImpl);
