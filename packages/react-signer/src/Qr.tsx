// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Columar, MarkError, QrDisplayPayload, QrScanSignature, Spinner } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate';

interface SigData {
  signature: string
}

interface Props {
  address: string;
  className?: string;
  genesisHash: Uint8Array;
  isHashed: boolean;
  isScanning: boolean;
  onSignature: (data: SigData) => void;
  payload: Uint8Array;
}

const CMD_HASH = 1;
const CMD_MORTAL = 2;

function Qr ({ address, className, genesisHash, isHashed, onSignature, payload }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [sigError, setSigError] = useState<string | null>(null);

  const _onSignature = useCallback(
    (data: SigData): void => {
      if (isHex(data.signature)) {
        onSignature(data);
      } else {
        const signature = data.signature as string;

        setSigError(t<string>('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.', {
          replace: {
            sample: signature.length > 47
              ? `${signature.substr(0, 24)}…${signature.substr(-22)}`
              : signature
          }
        }));
      }
    },
    [onSignature, t]
  );

  if (!address) {
    return (
      <Spinner label={t<string>('Preparing QR for signing')} />
    );
  }

  return (
    <>
      <Columar className={className}>
        <Columar.Column>
          <div className='qrDisplay'>
            <QrDisplayPayload
              address={address}
              cmd={
                isHashed
                  ? CMD_HASH
                  : CMD_MORTAL
              }
              genesisHash={genesisHash}
              payload={payload}
            />
          </div>
        </Columar.Column>
        <Columar.Column>
          <div className='qrDisplay'>
            <QrScanSignature onScan={_onSignature} />
          </div>
        </Columar.Column>
      </Columar>
      {sigError && (
        <MarkError
          className='nomargin'
          content={sigError}
        />
      )}
    </>
  );
}

export default React.memo(styled(Qr)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;

    img {
      border: 1px solid white;
    }
  }
`);
