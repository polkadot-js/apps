// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableResult } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { QueueTxMessageSetStatus, QueueTxPayloadAdd, QueueTxStatus } from '@polkadot/react-components/Status/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import { registry } from '@polkadot/react-api';
import { ClassOf } from '@polkadot/types/create';

export default class ApiSigner implements Signer {
  readonly #queuePayload: QueueTxPayloadAdd;

  readonly #queueSetTxStatus: QueueTxMessageSetStatus;

  constructor (queuePayload: QueueTxPayloadAdd, queueSetTxStatus: QueueTxMessageSetStatus) {
    this.#queuePayload = queuePayload;
    this.#queueSetTxStatus = queueSetTxStatus;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve, reject): void => {
      this.#queuePayload(payload, (id: number, result: SignerResult | null): void => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Unable to sign'));
        }
      });
    });
  }

  public update (id: number, result: Hash | SubmittableResult): void {
    if (result instanceof ClassOf(registry, 'Hash')) {
      this.#queueSetTxStatus(id, 'sent', result.toHex());
    } else {
      this.#queueSetTxStatus(id, result.status.type.toLowerCase() as QueueTxStatus, status);
    }
  }
}
