// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const SUPEROF_OPT = {
  transform: ([[ids], optSupers]: [[string[]], Option<ITuple<[AccountId]>>[]]): string[] =>
    optSupers
      .map((opt, index) =>
        // if we have a super, use that, otherwise we default to
        // the actual passed-in identity (which is top-level)
        opt.isSome
          ? opt.unwrap()[0].toString()
          : ids[index]
      )
      .reduce((all: string[], who): string[] => {
        // deupe all entries since we may have multiple nominees
        if (!all.includes(who)) {
          all.push(who);
        }

        return all;
      }, []),
  withParamsTransform: true
};

function useSuperIdsImpl (accountIds?: string[] | null): string[] | null | undefined {
  const { apiIdentity } = useApi();

  // for the supplied accounts, retrieve the de-dupes parent identity
  const identityParam = useMemo(
    () => accountIds && [accountIds],
    [accountIds]
  );

  const identities = useCall(identityParam && !!identityParam[0].length && apiIdentity.query.identity?.superOf?.multi, identityParam, SUPEROF_OPT);

  return useMemo(
    () => identityParam
      ? identityParam[0].length
        ? isFunction(apiIdentity.query.identity?.superOf)
          ? identities
          : accountIds
        : []
      : null,
    [apiIdentity, accountIds, identities, identityParam]
  );
}

export default createNamedHook('useSuperIds', useSuperIdsImpl);
