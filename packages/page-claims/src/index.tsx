// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useState, useCallback, useEffect } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Card, Columar, Column, Input, InputAddress, Tooltip } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { useTranslation } from './translate';
import { recoverFromJSON, getStatement } from './util';
import AttestDisplay from './Attest';
import ClaimDisplay from './Claim';
import Statement from './Statement';
import Warning from './Warning';

export { default as useCounter } from './useCounter';

enum Step {
  Account = 0,
  ETHAddress = 1,
  Sign = 2,
  Claim = 3,
}

const PRECLAIMS_LOADING = 'PRECLAIMS_LOADING';

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

function ClaimsApp (): React.ReactElement {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [step, setStep] = useState<Step>(Step.Account);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();

  // This preclaimEthereumAddress holds the result of `api.query.claims.preclaims`:
  // - an `EthereumAddress` when there's a preclaim
  // - null if no preclaim
  // - `PRECLAIMS_LOADING` if we're fetching the results
  const [preclaimEthereumAddress, setPreclaimEthereumAddress] = useState<string | null | undefined | typeof PRECLAIMS_LOADING>(PRECLAIMS_LOADING);
  const isPreclaimed = !!preclaimEthereumAddress && preclaimEthereumAddress !== PRECLAIMS_LOADING;

  // Everytime we change account, reset everything, and check if the accountId
  // has a preclaim.
  useEffect(() => {
    if (!accountId) {
      return;
    }

    setStep(Step.Account);
    setEthereumAddress(null);
    setPreclaimEthereumAddress(PRECLAIMS_LOADING);

    if (!api.query.claims || !api.query.claims.preclaims) {
      return setPreclaimEthereumAddress(null);
    }

    api.query.claims
      .preclaims<Option<EthereumAddress>>(accountId)
      .then((preclaim): void => {
        const address = preclaim.unwrapOr(null)?.toString();

        setEthereumAddress(address);
        setPreclaimEthereumAddress(address);
      })
      .catch((): void => setPreclaimEthereumAddress(null));
  }, [accountId, api.query.claims, api.query.claims.preclaims]);

  // Old claim process used `api.tx.claims.claim`, and didn't have attest
  const isOldClaimProcess = !api.tx.claims.claimAttest;

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);

  const goToStepAccount = useCallback(() => {
    setStep(Step.Account);
  }, []);

  const goToStepSign = useCallback(() => {
    setStep(Step.Sign);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  // Depending on the account, decide which step to show.
  const handleAccountStep = useCallback(() => {
    if (isPreclaimed) {
      goToStepClaim();
    } else if (ethereumAddress || isOldClaimProcess) {
      goToStepSign();
    } else {
      setStep(Step.ETHAddress);
    }
  }, [ethereumAddress, goToStepClaim, goToStepSign, isPreclaimed, isOldClaimProcess]);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { ethereumAddress, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress?.toString());
    setSignature(signature);
  }, []);

  const onChangeEthereumAddress = useCallback((value: string) => {
    // FIXME We surely need a better check than just a trim

    setEthereumAddress(value.trim());
  }, []);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  // If it's 1/ not preclaimed and 2/ not the old claiming process, fetch the
  // statement kind to sign.
  const statementKind = useCall<StatementKind | null>(!isPreclaimed && !isOldClaimProcess && !!ethereumAddress && api.query.claims.signing, [ethereumAddress], {
    transform: (option: Option<StatementKind>) => option.unwrapOr(null)
  });

  const statementSentence = getStatement(systemChain, statementKind)?.sentence || '';

  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}${statementSentence}`
    : '';

  return (
    <main>
      <header />
      {!isOldClaimProcess && <Warning />}
      <h1>
        <Trans>Claim your <em>{TokenUnit.abbr}</em> tokens</Trans>
      </h1>
      <Columar>
        <Column>
          <Card withBottomMargin>
            <h3>{t<string>('1. Select your {{chain}} account', {
              replace: {
                chain: systemChain
              }
            })}</h3>
            <InputAddress
              defaultValue={accountId}
              help={t<string>('The account you want to claim to.')}
              label={t<string>('claim to account')}
              onChange={setAccountId}
              type='all'
            />
            {(step === Step.Account) && (
              <Button.Group>
                <Button
                  icon='sign-in-alt'
                  isDisabled={preclaimEthereumAddress === PRECLAIMS_LOADING}
                  label={preclaimEthereumAddress === PRECLAIMS_LOADING
                    ? t<string>('Loading')
                    : t<string>('Continue')
                  }
                  onClick={handleAccountStep}
                />
              </Button.Group>
            )}
          </Card>
          {
            // We need to know the ethereuem address only for the new process
            // to be able to know the statement kind so that the users can sign it
            (step >= Step.ETHAddress && !isPreclaimed && !isOldClaimProcess) && (
              <Card withBottomMargin>
                <h3>{t<string>('2. Enter the ETH address from the sale.')}</h3>
                <Input
                  autoFocus
                  className='full'
                  help={t<string>('The the Ethereum address you used during the pre-sale (starting by "0x")')}
                  label={t<string>('Pre-sale ethereum address')}
                  onChange={onChangeEthereumAddress}
                  value={ethereumAddress || ''}
                />
                {(step === Step.ETHAddress) && (
                  <Button.Group>
                    <Button
                      icon='sign-in-alt'
                      isDisabled={!ethereumAddress}
                      label={t<string>('Continue')}
                      onClick={goToStepSign}
                    />
                  </Button.Group>
                )}
              </Card>
            )}
          {(step >= Step.Sign && !isPreclaimed) && (
            <Card>
              <h3>{t<string>('{{step}}. Sign with your ETH address', { replace: { step: isOldClaimProcess ? '2' : '3' } })}</h3>
              {!isOldClaimProcess && (
                <Statement
                  kind={statementKind}
                  systemChain={systemChain}
                />
              )}
              <div>{t<string>('Copy the following string and sign it with the Ethereum account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature object below:')}</div>
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
                text={didCopy ? t<string>('copied') : t<string>('click to copy')}
                trigger='tx-payload'
              />
              <Signature
                onChange={onChangeSignature}
                placeholder={`{\n  "address": "0x ...",\n  "msg": "${prefix}:...",\n  "sig": "0x ...",\n  "version": "2"\n}`}
                rows={10}
              />
              {(step === Step.Sign) && (
                <Button.Group>
                  <Button
                    icon='sign-in-alt'
                    isDisabled={!accountId || !signature}
                    label={t<string>('Confirm claim')}
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
              ? <AttestDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                onSuccess={goToStepAccount}
                statementKind={statementKind}
                systemChain={systemChain}
              />
              : <ClaimDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                ethereumSignature={signature}
                isOldClaimProcess={isOldClaimProcess}
                onSuccess={goToStepAccount}
                statementKind={statementKind}
                systemChain={systemChain}
              />
          )}
        </Column>
      </Columar>
    </main>
  );
}

export default React.memo(ClaimsApp);
