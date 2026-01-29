// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Columar, MarkError, QrDisplayPayload, QrScanSignature, Spinner, styled } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface SigData {
  signature: string
}

interface Props {
  address: string;
  className?: string;
  genesisHash: Uint8Array;
  isHashed: boolean;
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
        const signature = data.signature;

        setSigError(t('Non-signature, non-hex data received from QR. Data contains "{{sample}}" instead of a hex-only signature. Please present the correct signature generated from the QR presented for submission.', {
          replace: {
            sample: signature.length > 47
              ? `${signature.slice(0, 24)}…${signature.slice(-22)}`
              : signature
          }
        }));
      }
    },
    [onSignature, t]
  );

  if (!address) {
    return (
      <Spinner label={t('Preparing QR for signing')} />
    );
  }

  return (
    <>
      <StyledColumar className={className}>
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
      </StyledColumar>
      {sigError && (
        <MarkError
          className='nomargin'
          content={sigError}
        />
      )}
    </>
  );
}

const StyledColumar = styled(Columar)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;

    img {
      border: 1px solid white;
    }
  }
`;

export default React.memo(Qr);
