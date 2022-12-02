// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { getGovernanceTracks } from '@polkadot/apps-config';
import { formatNumber, stringPascalCase } from '@polkadot/util';

export function getTrackName (trackId: BN, { name }: PalletReferendaTrackInfo): string {
  return `${
    formatNumber(trackId)
  } / ${
    name
      .replace(/_/g, ' ')
      .split(' ')
      .map(stringPascalCase)
      .join(' ')
  }`;
}

export function getTrackInfo (api: ApiPromise, specName: string, palletReferenda: string, tracks?: [BN, PalletReferendaTrackInfo][], trackId?: number): { origin: Record<string, string>, text?: string } | undefined {
  let info: { origin: Record<string, string>, text?: string } | undefined;

  if (tracks && trackId !== undefined) {
    const originMap = getGovernanceTracks(api, specName, palletReferenda);
    const trackInfo = tracks.find(([id]) => id.eqn(trackId));

    if (trackInfo && originMap) {
      const trackName = trackInfo[1].name.toString();

      info = originMap.find(({ id, name }) =>
        id === trackId &&
        name === trackName
      );
    }
  }

  return info;
}
