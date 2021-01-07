// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';

export function sliceHex (value: Codec): string {
  const hex = value.toHex();

  return `${hex.slice(0, 18)}…${hex.slice(-16)}`;
}
