import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';

import { useTranslation } from './translate';
import { migrationApiUrl, removePrefixFromHex } from './index';

interface Props {
  title: string,
}

function StatusForm ({ title = 'Check token migration status' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [txHash, setTxHash] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmitStatus() {
    setSubmitting(true);
    setStatus(false);
    setError('');

    // Trim 0x from hash incase
    let txnHash = removePrefixFromHex(txHash);

    // Trim 0x from address incase
    let addr = removePrefixFromHex(address);

    try {
      const res = await axios.post(`${migrationApiUrl}/status`, {
        address: addr,
        txnHash,
      });
      if (!res.data.error) {
        setStatus(res.data.details);
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
          <Input
            help={t<string>('Enter the Ethereum address that you sent your tokens from')}
            label={t<string>('Ethereum address')}
            onChange={setAddress}
            value={address}
            isFull
          />

          <p style={{marginTop: '6px'}}>
            {t<string>(`The Ethereum address that you sent your tokens from`)}
          </p>

          <Input
            help={t<string>('Enter the Ethereum transaction hash in which you sent tokens to the Vault.')}
            label={t<string>('Transaction hash')}
            onChange={setTxHash}
            value={txHash}
            isFull
          />

          <p style={{marginTop: '6px'}}>
            {t<string>(`The Ethereum transaction hash in which you sent tokens to the Vault.`)}
          </p>

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

          <div>
            {status ? (
              status.status > -1 ? (
                <p style={{color: '#128de8'}}>
                  {status.messages.map((msg, i) => {
                    return <span key={i}>{msg}<br/></span>;
                  })}
                </p>
              ) : (
                <p style={{color: 'red'}}>
                  {status.messages.map((msg, i) => {
                    return <span key={i}>{msg}<br/></span>;
                  })}
                </p>
              )
            ) : (
              <p style={{color: '#d82323'}}>
                {error}
              </p>
            )}
          </div>
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(StatusForm);
