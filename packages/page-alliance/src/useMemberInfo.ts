// Copyright 2017-2023 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { bool, Option, UInt } from '@polkadot/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useMemberInfoImpl (accountId: string) {
  const { api } = useApi();
  const upForKicking: bool | undefined = useCall(api.query.alliance.upForKicking, [accountId]);
  const retiringAt: Option<UInt> | undefined = useCall(api.query.alliance.retiringMembers, [accountId]);
  const depositOf: Option<UInt> | undefined = useCall(api.query.alliance.depositOf, [accountId]);

  return useMemo(
    () => depositOf && {
      accountId,
      deposit: depositOf.unwrapOr(null),
      isUpForKicking: upForKicking && upForKicking.isTrue,
      retiringAt: retiringAt && retiringAt.unwrapOr(null)
    },
    [accountId, depositOf, retiringAt, upForKicking]
  );
}

export default createNamedHook('useMemberInfo', useMemberInfoImpl);
