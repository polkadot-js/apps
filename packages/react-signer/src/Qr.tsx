// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Columar, Spinner } from '@polkadot/react-components';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';

import { useTranslation } from './translate';

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

function Qr ({ address, className, genesisHash, isHashed, onSignature, payload }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!address) {
    return (
      <Spinner label={<div>{t('Preparing QR for signing')}</div>} />
    );
  }

  return (
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
          <QrScanSignature onScan={onSignature} />
        </div>
      </Columar.Column>
    </Columar>
  );
}

export default React.memo(styled(Qr)`
  .qrDisplay {
    margin: 0 auto;
    max-width: 30rem;
  }
`);
