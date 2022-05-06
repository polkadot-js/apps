// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
// import type { PalletUniquesClassDetails, PalletUniquesClassMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import { Struct } from '@polkadot/types-codec';
import { u32 } from '@polkadot/types';

export interface MintPolicy {
  maxTokenCount: BN | null;
  maxTokenSupply: BN | null;
  forceSingleMint: boolean;
}

export interface TransferPolicy {
  isFrozen: boolean;
}

export interface Policy {
  mint: MintPolicy;
  burn: null;
  transfer: TransferPolicy;
  attribute: null;
}

export interface Collection extends Struct {
  id: BN;
  owner: AccountId;
  policy: Policy;
  tokenCount: number;
  attributeCount: number;
  totalDeposit: BN;
}

export enum TokenCap {
  Supply,
  SingleMint
}

export interface Token extends Struct {
  id: BN;
  supply: BN;
  cap: TokenCap;
  isFrozen: boolean;
  minimumBalance: BN;
  unitPrice: BN;
  mintDeposit: BN;
  attributeCount: BN;
}

export interface Attribute extends Struct {
  value: u32;
  deposit: BN;
}
