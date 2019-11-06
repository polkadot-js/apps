// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SubmittableResult } from '@polkadot/api';
import { QueueTxPayloadAdd, QueueTxMessageSetStatus, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { Hash } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { ClassOf } from '@polkadot/types';

export default class ApiSigner implements Signer {
  private _queuePayload: QueueTxPayloadAdd;

  private _queueSetTxStatus: QueueTxMessageSetStatus;

  constructor (queuePayload: QueueTxPayloadAdd, queueSetTxStatus: QueueTxMessageSetStatus) {
    this._queuePayload = queuePayload;
    this._queueSetTxStatus = queueSetTxStatus;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve, reject): void => {
      this._queuePayload(payload, (id: number, result: SignerResult | null): void => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Unable to sign'));
        }
      });
    });
  }

  public update (id: number, result: Hash | SubmittableResult): void {
    if (result instanceof ClassOf('Hash')) {
      this._queueSetTxStatus(id, 'sent', result.toHex());
    } else {
      this._queueSetTxStatus(id, result.status.type.toLowerCase() as QueueTxStatus, status);
    }
  }
}
