// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface CollectionSupportedIpfsData {
  name: string | null;
  image: string | null;
}

export interface CollectionInfo {
  details: PalletUniquesClassDetails | null;
  id: BN;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletUniquesClassMetadata | null;
  ipfsData: CollectionSupportedIpfsData | null;
}

export interface CollectionInfoComplete extends CollectionInfo {
  details: PalletUniquesClassDetails;
  metadata: PalletUniquesClassMetadata;
}

export interface AccountItem {
  accountId: AccountId;
  collectionId: BN;
  itemId: BN;
}
