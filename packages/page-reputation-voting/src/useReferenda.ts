// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Referendum } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useReferendaIds from './useReferendaIds.js';

function sortReferenda (a: Referendum, b: Referendum): number {
  return (
    a.info.isOngoing === b.info.isOngoing
      ? a.info.isOngoing
        ? b.id.cmp(a.id)
        : 0
      : a.info.isOngoing
        ? -1
        : 1
  ) || b.id.cmp(a.id);
}

const OPT_MULTI = {
  transform: ([[ids], all]: [[BN[]], Option<Referendum['info']>[]]) =>
    ids.map((id, i) => {
      const infoOpt = all[i];
      const info = infoOpt?.isSome ? infoOpt.unwrap() : undefined;

      return {
        id,
        info,
        key: id.toString()
      };
    }).filter((r): r is Referendum => r.info !== undefined),
  withParamsTransform: true
};

function useReferendaImpl (): Referendum[] | undefined {
  const { api } = useApi();
  const ids = useReferendaIds();

  const referenda = useCall(
    ids && ids.length > 0 && api.query.referenda.referendumInfoFor.multi,
    [ids],
    { ...OPT_MULTI, defaultValue: [] as Referendum[] }
  );

  return useMemo(
    () => referenda?.sort(sortReferenda),
    [referenda]
  );
}

export default createNamedHook('useReferenda', useReferendaImpl);
