// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

export const RANGES: [number, number][] = [
  [0, 0], [0, 1], [0, 2], [0, 3],
  [1, 1], [1, 2], [1, 3],
  [2, 2], [2, 3],
  [3, 3]
];

export const CROWD_PREFIX = stringToU8a('modlpy/cfund');
