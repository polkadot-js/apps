// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';

import { stringPascalCase } from '@polkadot/util';

export function getTrackName ({ name }: PalletReferendaTrackInfo): string {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(stringPascalCase)
    .join(' ');
}
