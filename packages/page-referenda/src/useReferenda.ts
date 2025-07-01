// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { PalletReferenda, ReferendaGroup, ReferendaGroupKnown, Referendum, TrackDescription } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useReferendaIds from './useReferendaIds.js';
import useTracks from './useTracks.js';
import { calcDecidingEnd, getTrackName, isConvictionVote } from './util.js';

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

function sortReferenda (a: Referendum, b: Referendum): number {
  return (
    a.info.isOngoing === b.info.isOngoing
      ? a.info.isOngoing
        ? sortOngoing(a, b)
        : 0
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
    ids.map((id, i) => {
      const infoOpt = all[i];
      const info = infoOpt?.isSome ? infoOpt.unwrap() : undefined;

      return {
        id,
        info,
        isConvictionVote: info ? isConvictionVote(info) : false,
        key: id.toString()
      };
    }).filter((r) => r.info !== undefined),
  withParamsTransform: true
};

function group (tracks: TrackDescription[], totalIssuance?: BN, referenda?: Referendum[]): ReferendaGroup[] {
  if (!referenda || !totalIssuance) {
    // return an empty group when we have no referenda
    return [{ key: 'empty' }];
  } else if (!tracks) {
    // if we have no tracks, we just return the referenda sorted
    return [{ key: 'referenda', referenda: referenda.sort(sortReferenda) }];
  }

  const grouped: ReferendaGroupKnown[] = [];
  const other: ReferendaGroupKnown = { key: 'referenda', referenda: [] };

  // sort the referenda by track inside groups
  for (let i = 0, count = referenda.length; i < count; i++) {
    const ref = referenda[i];

    if (!ref.info || !ref.info.isOngoing) {
    // info is undefined or not ongoing — can't get track
      other.referenda.push(ref);
      continue;
    }

    const trackInfo = tracks.find(({ id }) =>
      id?.eq && id.eq(ref.info.asOngoing.track)
    );

    if (trackInfo) {
      ref.trackGraph = trackInfo.graph;
      ref.trackId = trackInfo.id;
      ref.track = trackInfo.info;

      if (ref.isConvictionVote) {
        const { deciding, tally } = ref.info.asOngoing;

        if (deciding.isSome) {
          const { since } = deciding.unwrap();

          ref.decidingEnd = calcDecidingEnd(totalIssuance, tally, trackInfo.info, since);
        }
      }

      const group = grouped.find(({ track }) => ref.track === track);

      if (!group) {
        // we don't have a group as of yet, create one
        grouped.push({
          key: `track:${ref.trackId.toString()}`,
          referenda: [ref],
          track: ref.track,
          trackGraph: ref.trackGraph,
          trackId: ref.trackId,
          trackName: getTrackName(ref.trackId, ref.track)
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
  for (let i = 0, count = grouped.length; i < count; i++) {
    grouped[i].referenda.sort(sortReferenda);
  }

  // sort all groups
  return grouped.sort(sortGroups);
}

function useReferendaImpl (palletReferenda: PalletReferenda): [ReferendaGroup[], TrackDescription[]] {
  const { api, isApiReady } = useApi();
  const totalIssuance = useCall<BN>(isApiReady && api.query.balances.totalIssuance);
  const ids = useReferendaIds(palletReferenda);
  const tracks = useTracks(palletReferenda);
  const referenda = useCall(isApiReady && ids && ids.length !== 0 && api.query[palletReferenda as 'referenda'].referendumInfoFor.multi, [ids], OPT_MULTI);

  return useMemo(
    () => [
      (ids && ids.length === 0)
        ? [{ key: 'referenda', referenda: [] }]
        : group(tracks, totalIssuance, (referenda as Referendum[])),
      tracks
    ],
    [ids, referenda, totalIssuance, tracks]
  );
}

export default createNamedHook('useReferenda', useReferendaImpl);
