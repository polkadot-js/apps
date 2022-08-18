// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesItemMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface ItemSupportedIpfsData {
  name: string | null;
  image: string | null;
}

export interface ItemInfo {
  account: AccountId,
  id: BN;
  key: string;
  metadata: PalletUniquesItemMetadata | null;
  ipfsData: ItemSupportedIpfsData | null;
}
