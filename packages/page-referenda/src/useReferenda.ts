// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaReferendumInfoConvictionVotingTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, Referendum } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useIds from './useIds';

const ORDER = <const> ['Ongoing', 'Approved', 'Rejected', 'Cancelled', 'Killed', 'TimedOut'];

function sortOngoing (a: Referendum, b: Referendum): number {
  const ona = a.info.asOngoing;
  const onb = b.info.asOngoing;

  return ona.track.cmp(onb.track) || a.id.cmp(b.id);
}

function sortOther (a: Referendum, b: Referendum): number {
  const idxa = ORDER.indexOf(a.info.type);
  const idxb = ORDER.indexOf(b.info.type);

  return (
    idxa === idxb
      ? 0
      : idxa === -1
        ? 1
        : idxb === -1
          ? -1
          : idxa - idxb
  ) || a.id.cmp(b.id);
}

const OPT_MULTI = {
  transform: ([[ids], all]: [[BN[]], Option<PalletReferendaReferendumInfoConvictionVotingTally>[]]) =>
    all
      .map((o, i) =>
        o.isSome
          ? [ids[i], o.unwrap()]
          : null
      )
      .filter((r): r is [BN, PalletReferendaReferendumInfoConvictionVotingTally] => !!r)
      .map(([id, info]): Referendum => ({
        id,
        info,
        key: id.toString()
      }))
      .sort((a, b) =>
        a.info.isOngoing === b.info.isOngoing
          ? a.info.isOngoing
            ? sortOngoing(a, b)
            : sortOther(a, b)
          : a.info.isOngoing
            ? -1
            : 1
      ),
  withParamsTransform: true
};

function useReferendaImpl (palletReferenda: PalletReferenda): Referendum[] | undefined {
  const { api } = useApi();
  const ids = useIds(palletReferenda);
  const referenda = useCall(ids && ids.length !== 0 && api.query[palletReferenda].referendumInfoFor.multi, [ids], OPT_MULTI);

  return useMemo(
    () => ids && ids.length === 0
      ? []
      : referenda,
    [ids, referenda]
  );
}

export default createNamedHook('useReferenda', useReferendaImpl);
