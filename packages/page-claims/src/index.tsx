// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';

import React, { useState, useCallback, useEffect } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Card, Columar, Column, InputAddress, Tooltip } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import AttestDisplay from './Attest';
import ClaimDisplay from './Claim';
import { recoverFromJSON } from './util';
import { useTranslation } from './translate';

import { useApi, useCall } from '@polkadot/react-hooks';

enum Step {
  Account = 0,
  Sign = 1,
  Claim = 2,
}

// FIXME no embedded components (hossible to tweak)
const Payload = styled.pre`
  cursor: copy;
  font-family: monospace;
  border: 1px dashed #c2c2c2;
  background: #f2f2f2;
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  white-space: normal;
  word-break: break-all;
`;

const Signature = styled.textarea`
  font-family: monospace;
  padding: 1rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.25rem;
  margin: 1rem 0;
  resize: none;
  width: 100%;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const ClaimsApp = (): React.ReactElement => {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<EthereumAddress | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [step, setStep] = useState<Step>(Step.Account);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();
  const isPreclaimed = useCall<boolean>(api.query.claims.preclaims, [accountId], {
    transform: (option: Option<EthereumAddress>) => option.isSome
  });

  const isOldClaimProcess = !api.query.claims.claimAttest;

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);

  const goToStepSign = useCallback(() => {
    setStep(Step.Sign);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  // Everytime we get a new preclaimed value (e.g. after we change account), we
  // decide on which step to show.
  useEffect(() => {
    if (isPreclaimed) {
      goToStepClaim();
    } else {
      goToStepSign();
    }
  }, [goToStepClaim, goToStepSign, isPreclaimed]);

  const onChangeAccount = useCallback((newAccountId) => {
    setAccountId(newAccountId);
  }, []);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { ethereumAddress, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress);
    setSignature(signature);
  }, []);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}`
    : '';

  return (
    <main>
      <header />
      <h1>
        <Trans>claim your <em>{TokenUnit.abbr}</em> tokens</Trans>
      </h1>
      <Columar>
        <Column>
          <Card withBottomMargin>
            <h3>{t('1. Select your {{chain}} account', {
              replace: {
                chain: systemChain
              }
            })}</h3>
            <InputAddress
              defaultValue={accountId}
              help={t('The account you want to claim to.')}
              label={t('claim to account')}
              onChange={onChangeAccount}
              type='all'
            />
            {(step === Step.Account) && (
              <Button.Group>
                <Button
                  icon='sign-in'
                  label={t('Continue')}
                  onClick={goToStepSign}
                />
              </Button.Group>
            )}
          </Card>
          {(step >= Step.Sign && !!accountId && !isPreclaimed) && (
            <Card>
              <h3>{t('2. Sign ETH transaction')}</h3>
              <CopyToClipboard
                onCopy={onCopy}
                text={payload}
              >
                <Payload
                  data-for='tx-payload'
                  data-tip
                >
                  {payload}
                </Payload>
              </CopyToClipboard>
              <Tooltip
                place='right'
                text={didCopy ? t('copied') : t('click to copy')}
                trigger='tx-payload'
              />
              <div>
                {t('Copy the above string and sign an Ethereum transaction with the account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature object below')}
                  :
              </div>
              <Signature
                onChange={onChangeSignature}
                placeholder={`{\n  "address": "0x ...",\n  "msg": "${prefix}:...",\n  "sig": "0x ...",\n  "version": "2"\n}`}
                rows={10}
              />
              {(step === Step.Sign) && (
                <Button.Group>
                  <Button
                    icon='sign-in'
                    isDisabled={!accountId || !signature}
                    label={t('Confirm claim')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              )}
            </Card>
          )}
        </Column>
        <Column showEmptyText={false}>
          {(step >= Step.Claim) && (
            isPreclaimed
              ? <AttestDisplay accountId={accountId} />
              : <ClaimDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                ethereumSignature={signature}
                isOldClaimProcess={isOldClaimProcess}
              />
          )}
        </Column>
      </Columar>
    </main>
  );
};

export default ClaimsApp;
