// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletUniquesCollectionDetails, PalletUniquesCollectionMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface CollectionSupportedMetadata {
  name: string | null;
  image: string | null;
}

export interface CollectionInfo {
  details: PalletUniquesCollectionDetails | null;
  id: BN;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletUniquesCollectionMetadata | null;
  ipfsData: CollectionSupportedMetadata | null;
}

export interface CollectionInfoComplete extends CollectionInfo {
  details: PalletUniquesCollectionDetails;
  metadata: PalletUniquesCollectionMetadata;
}

export interface AccountItem {
  accountId: AccountId;
  collectionId: BN;
  itemId: BN;
}
