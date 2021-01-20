// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerResult } from '@polkadot/api/types';

export interface AddressFlags {
  accountOffset: number;
  addressOffset: number;
  hardwareType?: string;
  isHardware: boolean;
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
