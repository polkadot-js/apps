// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { QueueTxExtrinsicAdd, QueueTxMessageSetStatus, QueueTxStatus } from '@polkadot/ui-app/Status/types';
import { SignatureOptions } from '@polkadot/types/types';

import { Hash } from '@polkadot/types';

export default class ApiSigner implements Signer {
  private _queueExtrinsic: QueueTxExtrinsicAdd;

  private _queueSetTxStatus: QueueTxMessageSetStatus;

  public constructor (queueExtrinsic: QueueTxExtrinsicAdd, queueSetTxStatus: QueueTxMessageSetStatus) {
    this._queueExtrinsic = queueExtrinsic;
    this._queueSetTxStatus = queueSetTxStatus;
  }

  public async sign (extrinsic: SubmittableExtrinsic, accountId: string, signerOptions: SignatureOptions): Promise<number> {
    return new Promise((resolve, reject): void => {
      this._queueExtrinsic({
        accountId,
        extrinsic,
        signerOptions,
        signerCb: (id: number, isSigned: boolean): void => {
          if (isSigned) {
            resolve(id);
          } else {
            reject(new Error());
          }
        }
      });
    });
  }

  public update (id: number, result: Hash | SubmittableResult): void {
    if (result instanceof Hash) {
      this._queueSetTxStatus(id, 'sent', result.toHex());
    } else {
      this._queueSetTxStatus(id, result.status.type.toLowerCase() as QueueTxStatus, status);
    }
  }
}
