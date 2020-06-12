// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Modal } from '@polkadot/react-components';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';

import { useTranslation } from '../translate';

interface Props extends BareProps {
  address: string;
  className?: string;
  genesisHash: Uint8Array;
  isHashed: boolean;
  isScanning: boolean;
  onSignature: (signature: { signature: string }) => void;
  payload: Uint8Array;
}

const CMD_HASH = 1;
const CMD_MORTAL = 2;

function Qr ({ address, className, genesisHash, isHashed, isScanning, onSignature, payload }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal.Columns className={className}>
      <Modal.Column>
        <div className={className}>
          {isScanning
            ? <QrScanSignature onScan={onSignature} />
            : <QrDisplayPayload
              address={address}
              cmd={
                isHashed
                  ? CMD_HASH
                  : CMD_MORTAL
              }
              genesisHash={genesisHash}
              payload={payload}
            />
          }
        </div>
      </Modal.Column>
      <Modal.Column>
        <p>
          {isScanning
            ? t('Present the QR code containing the signature to the UI. Once scanned it will be submitted for on-chain processing and execution.')
            : t('Scan the QR code with your QR scanner. Once approved, you will be required to present the signed QR back to the UI for submission.')
          }
        </p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(styled(Qr)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;
  }
`);
