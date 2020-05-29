// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerResult } from '@polkadot/api/types';

export interface Signed {
  data: Uint8Array;
  message: Uint8Array;
  signature: Uint8Array;
}

export interface QrState {
  isQrScanning: boolean;
  isQrVisible: boolean;
  qrAddress: string;
  qrIsHashed: boolean;
  qrPayload: Uint8Array;
  qrResolve?: (result: SignerResult) => void;
  qrReject?: (error: Error) => void;
}
