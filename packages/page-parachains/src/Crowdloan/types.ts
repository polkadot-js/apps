// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FundInfo, ParaId } from '@polkadot/types/interfaces';

export interface Campaign {
  info: FundInfo;
  isEnded?: boolean;
  paraId: ParaId;
}
