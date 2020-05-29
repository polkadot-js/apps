// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { QrState } from '../types';

import { registry } from '@polkadot/react-api';
import { blake2AsU8a } from '@polkadot/util-crypto';

export function signQrPayload (payload: SignerPayloadJSON, updateState: (state: QrState) => void): Promise<SignerResult> {
  return new Promise((resolve, reject): void => {
    // method is a hex-string, so 4000 / 2 for the length - with extra details, this is max 5 frames
    const qrIsHashed = (payload.method.length > 2000);
    const wrapper = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const qrPayload = qrIsHashed
      ? blake2AsU8a(wrapper.toU8a(true))
      : wrapper.toU8a();

    updateState({
      isQrScanning: false,
      isQrVisible: true,
      qrAddress: payload.address,
      qrIsHashed,
      qrPayload,
      qrReject: reject,
      qrResolve: resolve
    });
  });
}
