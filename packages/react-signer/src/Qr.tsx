// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
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

function Qr ({ address, className = '', genesisHash, isHashed, isScanning, onSignature, payload }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {
        isScanning
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
  );
}

export default React.memo(styled(Qr)`
  margin: 0 auto;
  max-width: 30rem;
`);
