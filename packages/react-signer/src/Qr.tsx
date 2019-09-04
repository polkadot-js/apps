// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps, BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';

import translate from './translate';

interface Props extends I18nProps, BareProps {
  address: string;
  isScanning: boolean;
  onSignature: (signature: { signature: string }) => void;
  payload: Uint8Array;
}

const CMD_MORTAL = 2;

function Qr ({ address, className, isScanning, onSignature, payload }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {
        isScanning
          ? <QrScanSignature onScan={onSignature} />
          : <QrDisplayPayload
            address={address}
            cmd={CMD_MORTAL}
            payload={payload}
          />
      }
    </div>
  );
}

export default translate(
  styled(Qr)`
    margin: 0 auto;
    max-width: 30rem;
  `
);
