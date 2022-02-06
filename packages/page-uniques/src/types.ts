// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletUniquesClassDetails, PalletUniquesClassMetadata, PalletUniquesInstanceDetails, PalletUniquesInstanceMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface UniqueInfo {
  details: PalletUniquesClassDetails | null;
  id: BN;
  isAdminMe: boolean;
  isIssuerMe: boolean;
  isFreezerMe: boolean;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletUniquesClassMetadata | null;
}

export interface UniqueInstanceInfo {
  details: PalletUniquesInstanceDetails | null;
  id: BN;
  isOwnerMe: boolean;
  key: string;
  metadata: PalletUniquesInstanceMetadata | null;
}

export interface UniqueInfoComplete extends UniqueInfo {
  details: PalletUniquesClassDetails;
  metadata: PalletUniquesClassMetadata;
}
