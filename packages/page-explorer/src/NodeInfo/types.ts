// Copyright 2017-2021 @polkadot/app-nodeinfo authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Vec } from '@polkadot/types';
import type { BlockNumber, Extrinsic, Health, PeerInfo } from '@polkadot/types/interfaces';

export interface Info {
  blockNumber?: BlockNumber;
  extrinsics?: Vec<Extrinsic> | null;
  health?: Health | null;
  peers?: PeerInfo[] | null;
}
