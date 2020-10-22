// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from './translate';

var bs58check = require('bs58check');
var Buffer = require('safe-buffer').Buffer;


interface Props {
  title: string,
}

function SwapForm ({ title = 'token swap' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [base58Check, setBase58Check] = useState<string>('');
  const [address, setAddress] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(keyring.getPairs()[0] || null);

  useEffect((): void => {
    setAddress(currentPair?.address || '');
  }, [currentPair?.address]);

  useEffect((): void => {
    if (!txHash || !address) {
      setBase58Check('');
      return;
    }

    const addressBuffer = Buffer.from(address);
    const txHashBuffer = Buffer.from(txHash);
    const b58Check = bs58check.encode(Buffer.concat([addressBuffer, txHashBuffer]));
    setBase58Check(b58Check);
  }, [address, txHash]);

  async function handleSubmitSwap() {
    setSubmitting(true);
  }

  return (
    <Table
      header={headerRef.current}
      className={'visible-overflow'}
    >
      <tr>
        <td>
          <InputAddress
            label={t<string>('Dock mainnet address')}
            onChange={setAddress}
            type='account'
            value={address}
            isFull
          />

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('TODO: transaction hash helper msg')}
                label={t<string>('transaction hash')}
                onChange={setTxHash}
                value={txHash}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`TODO: transaction hash helper msg`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('TODO: base58 check msg')}
                label={t<string>('base58 check encoding')}
                value={base58Check}
                disabled
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>
                The user will take this base58 string (including checksum), sign using mycrypto and his public key and get signature
              </p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('TODO: signature msg')}
                label={t<string>('signature')}
                onChange={setSignature}
                value={signature}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`The signature is put in the form and form is submitted.`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <div style={{textAlign: 'right'}}>
            <Button
              accountId={address}
              icon='sign-in-alt'
              isDisabled={submitting || !(address && signature && txHash)}
              isPrimary={true}
              label={t<string>(submitting ? 'Please wait...' : 'Submit')}
              onClick={handleSubmitSwap}
            />
          </div>
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(SwapForm);
