// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Columar } from '@canvas-ui/react-components';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';

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
