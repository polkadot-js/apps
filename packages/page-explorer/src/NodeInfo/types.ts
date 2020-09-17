// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BlockNumber, Extrinsic, Health, PeerInfo } from '@polkadot/types/interfaces';

import { Vec } from '@polkadot/types';

export interface Info {
  blockNumber?: BlockNumber;
  extrinsics?: Vec<Extrinsic> | null;
  health?: Health | null;
  peers?: PeerInfo[] | null;
}
