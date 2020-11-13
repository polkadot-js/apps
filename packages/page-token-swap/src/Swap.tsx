import bs58 from 'bs58';
import bs58check from 'bs58check';
import { Buffer } from 'safe-buffer';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table, Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton, Checkbox } from '@polkadot/react-components';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import axios from 'axios';

import { useTranslation } from './translate';

interface Props {
  title: string,
}
const apiUrl = 'http://localhost:8080';
const useBonusCheckbox = true;

function SwapForm ({ title = 'Submit token migration request' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [base58Check, setBase58Check] = useState<string>('');
  const [address, setAddress] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(keyring.getPairs()[0] || null);
  const [isSelected, setIsSelected] = useState(false);

  useEffect((): void => {
    setAddress(currentPair?.address || '');
  }, [currentPair?.address]);

  useEffect((): void => {
    if (!txHash || !address) {
      setBase58Check('');
      setError('');
      return;
    }

    // Trim 0x from hash incase
    let txnHash = txHash;
    if (txnHash.substr(0, 2) === '0x') {
      txnHash = txnHash.substr(2);
    }

    // Build payload
    try {
      const arrayBuff = [bs58.decode(address), Buffer.from(txnHash, 'hex')];
      if (useBonusCheckbox) {
        arrayBuff.push(Buffer.from(isSelected ? '1' : '0'));
      }

      const payloadRaw = Buffer.concat(arrayBuff);
      const payloadCheck = bs58check.encode(payloadRaw);
      setBase58Check(payloadCheck);
      setError('');
    } catch (e) {
      setError(e.toString());
      setBase58Check('');
    }
  }, [address, txHash, isSelected]);

  async function handleSubmitSwap() {
    setSubmitting(true);
    setSuccess(false);
    setError('');

    try {
      const res = await axios.post(`${apiUrl}/` + (isSelected ? `migrate_with_bonus` : `migrate`), {
        payload: base58Check,
        signature,
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

  function _onSelect() {
    setIsSelected(!isSelected);
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
              <InputAddress
                label={t<string>('Dock mainnet address')}
                onChange={setAddress}
                type='account'
                value={address}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`Go to the accounts page and add or create an account if one doesn't appear here.`)}</p>
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

          {useBonusCheckbox && (
            <Modal.Columns>
              <Modal.Column>
              </Modal.Column>x
              <Modal.Column>
                <div style={{display: 'flex'}}>
                  <Checkbox
                    onChange={_onSelect}
                    value={isSelected}
                  />
                  <p style={{marginLeft: '10px'}}>{t<string>(`Opt-in for vesting bonus?`)}</p>
                </div>
              </Modal.Column>
            </Modal.Columns>
          )}

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('Take this unique code and sign it using MyCrypto or a similar tool using your Ethereum keypair in order to generate a signature.')}
                label={t<string>('Code to sign')}
                value={base58Check}
                disabled
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>
                Take this unique code and sign it using MyCrypto or a similar tool using your Ethereum keypair in order to generate a signature.
              </p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              <Input
                help={t<string>('Enter the signature over the above code.')}
                label={t<string>('Signature')}
                onChange={setSignature}
                value={signature}
                isFull
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>(`Enter the signature over the above code.`)}</p>
            </Modal.Column>
          </Modal.Columns>

          <Modal.Columns>
            <Modal.Column>
              {success ? (
                <p style={{color: 'green'}}>
                  Success! Your token migration request has been submitted and is being processed. Check the status with the other form on this page.
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
                isDisabled={submitting || !(address && signature && txHash)}
                isPrimary={true}
                label={t<string>(submitting ? 'Please wait...' : 'Submit')}
                onClick={handleSubmitSwap}
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
