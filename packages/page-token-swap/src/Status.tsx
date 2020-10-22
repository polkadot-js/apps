import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';
const apiUrl = 'http://localhost:8080';

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
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmitStatus() {
    setSubmitting(true);
    setSuccess(false);
    setError('');

    try {
      const res = await axios.post(`${apiUrl}/status`, {
        address,
        txHash,
      });
      if (!res.data.error) {
        setSuccess(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }

    setSubmitting(false);
  }

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

          <Modal.Columns>
            <Modal.Column>
              {success ? (
                <p>
                  Status: processing
                </p>
              ) : (
                <p style={{color: '#d82323'}}>
                  {error}
                </p>
              )}
            </Modal.Column>
            <Modal.Column>
            <div style={{textAlign: 'right', display: 'inline-block', float: 'right'}}>
              <Button
                accountId={address}
                icon='sign-in-alt'
                isDisabled={!(address && txHash)}
                isPrimary={true}
                label={t<string>('Check Status')}
                onClick={handleSubmitStatus}
              />
            </div>
            </Modal.Column>
          </Modal.Columns>
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(SwapForm);
