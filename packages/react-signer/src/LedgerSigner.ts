// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Signer, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import { getLedger, registry } from '@canvas-ui/react-api';
import { createType } from '@polkadot/types';

let id = 0;

export class LedgerSigner implements Signer {
  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = createType(registry, 'ExtrinsicPayload', payload, { version: payload.version });
    const { signature } = await getLedger().sign(raw.toU8a(true));

    return { id: ++id, signature };
  }
}

const ledgerSigner = new LedgerSigner();

export default ledgerSigner;
