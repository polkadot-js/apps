import bs58 from 'bs58';
import bs58check from 'bs58check';
import { Buffer } from 'safe-buffer';
import Stepper from 'react-stepper-horizontal';

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

function SwapForm ({ title = 'Token migration request' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t(title), 'start', 3]
  ]);

  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [success, setSuccess] = useState<Boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [base58Check, setBase58Check] = useState<string>('');
  const [address, setAddress] = useState<string | null>(null);
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(keyring.getPairs()[0] || null);
  const [isSelected, setIsSelected] = useState(false);
  const [termsSelected, setTermsSelected] = useState(false);

  function handleResetState() {
    setSuccess(false);
    setError('');
    setActiveStep(0);
    setSubmitting(false);
    setTxHash('');
    setSignature('');
    setBase58Check('');
  }

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

    const signatureb58 = bs58check.encode(Buffer.from(signature, 'hex'));
    try {
      const res = await axios.post(`${apiUrl}/` + (useBonusCheckbox ? `migrate_with_bonus` : `migrate`), {
        payload: base58Check,
        signature: signatureb58,
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

  function _onSelectTerms() {
    setTermsSelected(!termsSelected);
  }

  function canSubmitStep() {
    if (activeStep === 0) {
      return !!address;
    } else if (activeStep === 1) {
      return !!txHash;
    } else {
      return !!signature;
    }
  }

  const steps = [
    {
      title: 'Destination address',
      onClick: () => {
        setActiveStep(0);
      }
    },
    {
      title: 'Send ERC-2O tokens',
      onClick: () => {
        setActiveStep(1);
      }
    },
    {
      title: 'Sign & submit',
      onClick: () => {
        setActiveStep(2);
      }
    }
  ];

  const stepElements = [(
    <>
      <p style={{marginTop: '24px'}}>
        <strong>Mainnet address</strong><br />
        Add an address on the Dock mainnet to receive the migrating tokens.<br />
        Don't have a mainnet address? <a href="/#/accounts">Create a Dock token wallet</a>
      </p>
      <InputAddress
        label={t<string>('Dock mainnet address')}
        onChange={setAddress}
        type='account'
        value={address}
        isFull
      />
    </>
  ), (
    <>
      <p style={{marginTop: '24px'}}>
        <strong>Send ERC-2O tokens</strong><br />
        Send your ERC-20 DOCK tokens to the Dock Vault. <a href="https://docs.dock.io/migration-support" target="_blank">See how it works</a><br />
        Once sent, copy the transaction hash and paste below.
      </p>
      <p style={{marginTop: '24px'}}>
        <strong>Transaction hash</strong><br />
        Add the Ethereum transaction hash in which you sent tokens to the Vault.
      </p>

      <Input
        help={t<string>('Enter the Ethereum transaction hash in which you sent tokens to the Vault.')}
        label={t<string>('Transaction hash')}
        onChange={setTxHash}
        value={txHash}
        isFull
      />
    </>
  ), (
    <>
      {useBonusCheckbox && (
        <div style={{display: 'flex'}}>
          <Checkbox
            onChange={_onSelect}
            value={isSelected}
          />
          <p style={{marginLeft: '10px'}}>
            {t<string>(`Opt-in for vesting bonus (Optional)`)}<br />
            <span style={{fontSize: '13px', color: 'rgb(138, 138, 138)'}}>
              By checking this box, I opt-in to participate in the vesting bonus and understand the terms of the vesting bonus, including the vesting schedule, which can be found <a href="https://docs.dock.io/migration-support" target="_blank">here</a>.
            </span>
          </p>
        </div>
      )}
      
      <div style={{backgroundColor: '#FAFAFA', border: '1px solid #ECEBED', padding: '20px', marginTop: '10px'}}>
        <p>
          <strong>Generate signature</strong><br />
          Use this code to sign your transaction using MyCrypto or a similar tool using your Ethereum keypair in order to generate a signature. <a href="https://docs.dock.io/migration-support">See how it works</a>
        </p>
        <Input
          help={t<string>('Take this unique code and sign it using MyCrypto or a similar tool using your Ethereum keypair in order to generate a signature.')}
          label={t<string>('Code to sign')}
          value={base58Check}
          disabled
          isFull
        />
      </div>

      <br />

      <p>
        <strong>Signature</strong><br />
        Add the signature generated from signing the above code
      </p>

      <Input
        help={t<string>('Enter the signature over the above code.')}
        label={t<string>('Signature')}
        onChange={setSignature}
        value={signature}
        isFull
      />

      <br />

      <div style={{display: 'flex'}}>
        <Checkbox
          onChange={_onSelectTerms}
          value={termsSelected}
        />
        <p style={{marginLeft: '10px'}}>
          I agree to Dock's <a href="https://docs.dock.io/migration-terms-and-conditions" target="_blank">Terms & Conditions</a>
        </p>
      </div>

      <br />

      
    </>
  )];

  return (
    <Table
      header={headerRef.current}
      className={'visible-overflow'}
    >
      <tr>
        <td>
          <p>
            Migrate ERC-20 DOCK tokens to Dock's native tokens.
          </p>
        </td>
      </tr>
      <tr>
        <td style={{backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(34, 36, 38, 0.15)', paddingBottom: '20px', marginBottom: '10px', circleTop: '0'}}>
            <Stepper steps={steps} activeStep={activeStep} {...{
              titleFontSize: 13,
              circleFontSize: 11,
              circleTop: 16,
              size: 25
            }} />
        </td>
      </tr>
      <tr>
        <td>
          {success ? (
            <>
              <div style={{textAlign: 'center', margin: '40px auto'}}>
                <p style={{fontSize: '24px'}}>
                  Successfully submitted
                </p>
                <p>
                  Your token migration request is being processed<br /><br />
                  Check the status of your request <a href="/#/token-swap/status" onClick={handleResetState}>here</a>.
                </p>
              </div>
              <div style={{float: 'right'}}>
                <Button
                  isPrimary={true}
                  label={t<string>('Submit another request')}
                  onClick={handleResetState}
                />
              </div>
            </>
          ) : (
            <>
              {stepElements[activeStep]}
              <br />
              {activeStep < 2 ? (
                <div style={{textAlign: 'right', display: 'inline-block', float: 'right', marginTop: '20px'}}>
                  <Button
                    icon='chevron-right'
                    isDisabled={submitting || !canSubmitStep()}
                    isPrimary={true}
                    label={t<string>(' Next')}
                    onClick={() => {
                      setActiveStep(activeStep + 1);
                    }}
                  />
                </div>
              ) : (
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
                      isDisabled={!termsSelected || submitting || !(address && signature && txHash)}
                      isPrimary={true}
                      label={t<string>(submitting ? 'Please wait...' : 'Submit request')}
                      onClick={handleSubmitSwap}
                    />
                  </div>
                  </Modal.Column>
                </Modal.Columns>
              )}
            </>
          )}
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(SwapForm);
