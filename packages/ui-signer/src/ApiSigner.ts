// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { SignatureOptions } from '@polkadot/types/ExtrinsicSignature';

export default class ApiSigner implements Signer {
  private _queueExtrinsic: QueueTx$ExtrinsicAdd;

  constructor (queueExtrinsic: QueueTx$ExtrinsicAdd) {
    this._queueExtrinsic = queueExtrinsic;
  }

  async sign (extrinsic: SubmittableExtrinsic, accountId: string, options: SignatureOptions): Promise<void> {
    this._queueExtrinsic({
      accountId,
      extrinsic
    });
  }
}
