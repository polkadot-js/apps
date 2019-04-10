// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { QueueTx$ExtrinsicAdd, QueueTx$MessageSetStatus } from '@polkadot/ui-app/Status/types';
import { SignatureOptions } from '@polkadot/types/types';

import { Hash } from '@polkadot/types';

export default class ApiSigner implements Signer {
  private _queueExtrinsic: QueueTx$ExtrinsicAdd;
  private _queueSetTxStatus: QueueTx$MessageSetStatus;

  constructor (queueExtrinsic: QueueTx$ExtrinsicAdd, queueSetTxStatus: QueueTx$MessageSetStatus) {
    this._queueExtrinsic = queueExtrinsic;
    this._queueSetTxStatus = queueSetTxStatus;
  }

  async sign (extrinsic: SubmittableExtrinsic, accountId: string, signerOptions: SignatureOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      this._queueExtrinsic({
        accountId,
        extrinsic,
        signerOptions,
        signerCb: (id: number, isSigned: boolean): void => {
          if (isSigned) {
            resolve(id);
          } else {
            reject();
          }
        }
      });
    });
  }

  update (id: number, result: Hash | SubmittableResult): void {
    if (result instanceof Hash) {
      this._queueSetTxStatus(id, 'sent', result.toHex());
    } else {
      this._queueSetTxStatus(id, result.status.type.toLowerCase() as any, status);
    }
  }
}
