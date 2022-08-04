// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, Referendum } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useReferendaIds from './useReferendaIds';

const ORDER = <const> ['Ongoing', 'Approved', 'Rejected', 'Cancelled', 'Killed', 'TimedOut'];

function isConvictionVote (info: Referendum['info']): info is PalletReferendaReferendumInfoConvictionVotingTally {
  return info.isOngoing && !(info as PalletReferendaReferendumInfoRankedCollectiveTally).asOngoing.tally.bareAyes && !!(info as PalletReferendaReferendumInfoConvictionVotingTally).asOngoing.tally.support;
}

function sortOngoing (a: Referendum, b: Referendum): number {
  return a.info.asOngoing.track.cmp(b.info.asOngoing.track) || a.id.cmp(b.id);
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
  transform: ([[ids], all]: [[BN[]], Option<Referendum['info']>[]]) =>
    all
      .map((o, i) =>
        o.isSome
          ? [ids[i], o.unwrap()]
          : null
      )
      .filter((r): r is [BN, Referendum['info']] => !!r)
      .map(([id, info]): Referendum => ({
        id,
        info,
        isConvictionVote: isConvictionVote(info),
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
  const { api, isApiReady } = useApi();
  const ids = useReferendaIds(palletReferenda);
  const referenda = useCall(isApiReady && ids && ids.length !== 0 && api.query[palletReferenda].referendumInfoFor.multi, [ids], OPT_MULTI);

  return useMemo(
    () => ids && ids.length === 0
      ? []
      : referenda,
    [ids, referenda]
  );
}

export default createNamedHook('useReferenda', useReferendaImpl);
