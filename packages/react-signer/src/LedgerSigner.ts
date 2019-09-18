// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { getLedger } from '@polkadot/react-api';
import { createType } from '@polkadot/types';

export class LedgerSigner implements Signer {
  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = createType('ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await getLedger().sign(raw.toU8a(true));

    return { id: 0, signature };
  }
}

const ledgerSigner = new LedgerSigner();

export default ledgerSigner;
