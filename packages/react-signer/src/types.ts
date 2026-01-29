// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SignerResult } from '@polkadot/api/types';
import type { AssetInfoComplete } from '@polkadot/react-hooks/types';

export interface AddressFlags {
  accountOffset: number;
  addressOffset: number;
  hardwareType?: string;
  isHardware: boolean;
  isLocal: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isQr: boolean;
  isUnlockable: boolean;
  threshold: number;
  who: string[];
}

export interface AddressProxy {
  isMultiCall: boolean;
  isUnlockCached: boolean;
  multiRoot: string | null;
  proxyRoot: string | null;
  signAddress: string | null;
  signPassword: string;
}

export interface QrState {
  isQrHashed: boolean;
  qrAddress: string;
  qrPayload: Uint8Array;
  qrResolve?: (result: SignerResult) => void;
  qrReject?: (error: Error) => void;
}

export interface Signed {
  data: Uint8Array;
  message: Uint8Array;
  signature: Uint8Array;
}

export type ExtendedSignerOptions = (Partial<SignerOptions & { feeAsset: AssetInfoComplete | null }>) | undefined;
