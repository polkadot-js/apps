import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';
const apiUrl = 'http://localhost:8080';

interface Props {
  title: string,
}

const statusMap = {
  '-2': 'Sender address was blacklisted',
  '-1': 'Invalid due to any reason, like txn was not for Dock\'s contract or was not for Dock\'s vault address',
  '0': 'Signature valid but transaction not parsed to find out how many tokens to transfer.',
  '1': 'Parsed and checked that was intended for Dock\'s contract and vault address but not sufficient confirmations',
  '2': 'Sufficient confirmations',
  '3': 'Initial transfer done',
  '4': 'Bonus has been calculated but not yet sent.',
  '5': 'Bonus sent',
};

function SwapForm ({ title = 'Check token migration status' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmitStatus() {
    setSubmitting(true);
    setStatus(false);
    setError('');

    // Trim 0x from hash incase
    let txnHash = txHash;
    if (txnHash.substr(0, 2) === '0x') {
      txnHash = txnHash.substr(2);
    }

    try {
      const res = await axios.post(`${apiUrl}/status`, {
        address,
        txnHash,
      });
      if (!res.data.error) {
        const status = res.data.status;
        setStatus(statusMap[status]);
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
                label={t<string>('Ethereum address')}
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
                help={t<string>('Enter the Ethereum transaction hash in which you sent tokens to the Vault.')}
                label={t<string>('Transaction hash')}
                onChange={setTxHash}
                value={txHash}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`Enter the Ethereum transaction hash in which you sent tokens to the Vault.`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              {status ? (
                <p>
                  Status: {status}
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
