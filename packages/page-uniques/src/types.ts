// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
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

export interface UniqueInfoComplete extends UniqueInfo {
  details: PalletUniquesClassDetails;
  metadata: PalletUniquesClassMetadata;
}
