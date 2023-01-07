// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletReferendaDeposit } from '@polkadot/types/lookup';
import type { Referendum, TrackDescription } from '../types';
import type { TrackOption } from './types';

import React from 'react';

import { Option } from '@polkadot/types';

import { getTrackInfo, getTrackName } from '../util';

export function unwrapDeposit (value: PalletReferendaDeposit | Option<PalletReferendaDeposit>): PalletReferendaDeposit | null {
  return value instanceof Option
    ? value.unwrapOr(null)
    : value;
}

export function getNumDeciding (referenda?: Referendum[]): number {
  if (!referenda) {
    return 0;
  }

  return referenda.filter(({ info }) =>
    info.isOngoing &&
    info.asOngoing.deciding.isSome
  ).length;
}

export function getTrackOptions (api: ApiPromise, specName: string, palletReferenda: string, tracks?: TrackDescription[]): undefined | TrackOption[] {
  return tracks && tracks.map(({ id, info }): TrackOption => {
    const trackInfo = getTrackInfo(api, specName, palletReferenda, tracks, id.toNumber());
    const trackName = getTrackName(id, info);

    return {
      text: trackInfo?.text
        ? (
          <div className='trackOption'>
            <div className='normal'>{trackName}</div>
            <div className='faded'>{trackInfo.text}</div>
          </div>
        )
        : trackName,
      value: id.toNumber()
    };
  });
}
