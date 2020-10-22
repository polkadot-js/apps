// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';

var bs58check = require('bs58check');
var Buffer = require('safe-buffer').Buffer;


interface Props {
  title: string,
}

function SwapForm ({ title = 'check swap status' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  return (
    <Table
      header={headerRef.current}
      className={'visible-overflow'}
    >
      <tr>
        <td>
          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('Enter the Ethereum address that you sent your tokens from')}
                label={t<string>('ethereum address')}
                onChange={setAddress}
                value={address}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`Enter the Ethereum address that you sent your tokens from`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('Enter the transaction hash of when you sent the tokens')}
                label={t<string>('transaction hash')}
                onChange={setTxHash}
                value={txHash}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`Enter the transaction hash of when you sent the tokens`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <div style={{textAlign: 'right'}}>
            <Button
              accountId={address}
              icon='sign-in-alt'
              isDisabled={!(address && txHash)}
              isPrimary={false}
              label={t<string>('Check Status')}
            />
          </div>
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(SwapForm);
