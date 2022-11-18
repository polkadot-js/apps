// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, ReferendaGroup, ReferendaGroupKnown, Referendum } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import useReferendaIds from './useReferendaIds';
import useTracks from './useTracks';
import { getTrackName } from './util';

function isConvictionVote (info: Referendum['info']): info is PalletReferendaReferendumInfoConvictionVotingTally {
  return info.isOngoing && !(info as PalletReferendaReferendumInfoRankedCollectiveTally).asOngoing.tally.bareAyes && !!(info as PalletReferendaReferendumInfoConvictionVotingTally).asOngoing.tally.support;
}

function sortOngoing (a: Referendum, b: Referendum): number {
  const ao = a.info.asOngoing;
  const bo = b.info.asOngoing;

  return ao.track.cmp(bo.track) || (
    ao.deciding.isSome === bo.deciding.isSome
      ? ao.deciding.isSome
        ? a.info.asOngoing.deciding.unwrap().since.cmp(
          b.info.asOngoing.deciding.unwrap().since
        )
        : 0
      : ao.deciding.isSome
        ? -1
        : 1
  );
}

function getWhen ({ info }: Referendum): BN {
  return info.isApproved
    ? info.asApproved[0]
    : info.isRejected
      ? info.asRejected[0]
      : info.isCancelled
        ? info.asCancelled[0]
        : info.isTimedOut
          ? info.asTimedOut[0]
          : info.isKilled
            ? info.asKilled
            // this is an actual unknown state...
            : BN_ZERO;
}

function sortReferenda (a: Referendum, b: Referendum): number {
  return (
    a.info.isOngoing === b.info.isOngoing
      ? a.info.isOngoing
        ? sortOngoing(a, b)
        : getWhen(b).cmp(getWhen(a))
      : a.info.isOngoing
        ? -1
        : 1
  ) || b.id.cmp(a.id);
}

function sortGroups (a: ReferendaGroupKnown, b: ReferendaGroupKnown): number {
  return a.trackId && b.trackId
    ? a.trackId.cmp(b.trackId)
    : a.trackId
      ? -1
      : 1;
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
      })),
  withParamsTransform: true
};

function group (referenda?: Referendum[], tracks?: [BN, PalletReferendaTrackInfo][]): ReferendaGroup[] {
  if (!referenda) {
    // return an empty group when we have no referenda
    return [{}];
  } else if (!tracks) {
    // if we have no tracks, we just return the referenda sorted
    return [{ referenda: referenda.sort(sortReferenda) }];
  }

  const grouped: ReferendaGroupKnown[] = [];
  const other: ReferendaGroupKnown = { referenda: [] };

  // sort the referenda by track inside groups
  for (let i = 0; i < referenda.length; i++) {
    const ref = referenda[i];

    // only ongoing have tracks
    const trackInfo = ref.info.isOngoing
      ? tracks.find(([id]) => id.eq(ref.info.asOngoing.track))
      : undefined;

    if (trackInfo) {
      ref.trackId = trackInfo[0];
      ref.track = trackInfo[1];

      const group = grouped.find(({ track }) => ref.track === track);

      if (!group) {
        // we don't have a group as of yet, create one
        grouped.push({
          referenda: [ref],
          track: ref.track,
          trackId: ref.trackId,
          trackName: getTrackName(ref.track)
        });
      } else {
        // existing group, just add the referendum
        group.referenda.push(ref);
      }
    } else {
      // if we have no track, we just add it to "other"
      other.referenda.push(ref);
    }
  }

  // if we do have items in "other", we add it (or if none, then empty other)
  if ((other.referenda && other.referenda.length !== 0) || !grouped.length) {
    grouped.push(other);
  }

  // sort referenda per group
  for (let i = 0; i < grouped.length; i++) {
    grouped[i].referenda.sort(sortReferenda);
  }

  // sort all groups
  return grouped.sort(sortGroups);
}

function useReferendaImpl (palletReferenda: PalletReferenda): [ReferendaGroup[], [BN, PalletReferendaTrackInfo][] | undefined] {
  const { api, isApiReady } = useApi();
  const ids = useReferendaIds(palletReferenda);
  const tracks = useTracks(palletReferenda);
  const referenda = useCall(isApiReady && ids && ids.length !== 0 && api.query[palletReferenda as 'referenda'].referendumInfoFor.multi, [ids], OPT_MULTI);

  return useMemo(
    () => [
      (ids && ids.length === 0)
        ? [{ referenda: [] }]
        : group(referenda, tracks),
      tracks
    ],
    [ids, referenda, tracks]
  );
}

export default createNamedHook('useReferenda', useReferendaImpl);
