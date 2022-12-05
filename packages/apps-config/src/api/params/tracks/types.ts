// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type Origin = { system: string } | { Origins: string };

export interface TrackInfo {
  id: number;
  name: string;
  origin: Origin | Origin[];
  text?: string;
}
