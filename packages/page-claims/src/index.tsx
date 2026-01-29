// Copyright 2017-2025 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Trans } from 'react-i18next';

import { Button, Card, Columar, Input, InputAddress, styled, Tabs, Tooltip } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputConsts/units';
import { useApi, useCall } from '@polkadot/react-hooks';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import AttestDisplay from './Attest.js';
import ClaimDisplay from './Claim.js';
import Statement from './Statement.js';
import { useTranslation } from './translate.js';
import { getStatement, recoverFromJSON } from './util.js';
import Warning from './Warning.js';

export { default as useCounter } from './useCounter.js';

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
  font: var(--font-mono);
  border: 1px dashed #c2c2c2;
  background: #f2f2f2;
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  white-space: normal;
  word-break: break-all;
`;

const Signature = styled.textarea`
  font: var(--font-mono);
  padding: 1rem;
  border: 1px solid var(--border-input);
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

const transformStatement = {
  transform: (option: Option<StatementKind>) => option.unwrapOr(null)
};

function ClaimsApp ({ basePath }: Props): React.ReactElement<Props> {
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
  const [preclaimEthereumAddress, setPreclaimEthereumAddress] = useState<string | null | undefined>(PRECLAIMS_LOADING);
  const isPreclaimed = !!preclaimEthereumAddress && preclaimEthereumAddress !== PRECLAIMS_LOADING;

  const itemsRef = useRef([{
    isRoot: true,
    name: 'create',
    text: t('Claim tokens')
  }]);

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
      .catch((error): void => {
        console.error(error);

        setPreclaimEthereumAddress(null);
      });
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
  const statementKind = useCall<StatementKind | null>(!isPreclaimed && !isOldClaimProcess && !!ethereumAddress && api.query.claims.signing, [ethereumAddress], transformStatement);

  const statementSentence = getStatement(systemChain, statementKind)?.sentence || '';
  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${u8aToHex(decodeAddress(accountId), -1, false)}${statementSentence}`
    : '';

  return (
    <main>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      {!isOldClaimProcess && <Warning />}
      <h1>
        <Trans>Claim your <em>{TokenUnit.abbr}</em> tokens</Trans>
      </h1>
      <Columar>
        <Columar.Column>
          <Card withBottomMargin>
            <h2>{t('1. Select your {{chain}} account', {
              replace: {
                chain: systemChain
              }
            })}</h2>
            <InputAddress
              defaultValue={accountId}
              label={t('claim to account')}
              onChange={setAccountId}
              type='all'
            />
            {(step === Step.Account) && (
              <Button.Group>
                <Button
                  icon='sign-in-alt'
                  isDisabled={preclaimEthereumAddress === PRECLAIMS_LOADING}
                  label={preclaimEthereumAddress === PRECLAIMS_LOADING
                    ? t('Loading')
                    : t('Continue')
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
                <h2>{t('2. Enter the ETH address from the sale.')}</h2>
                <Input
                  autoFocus
                  className='full'
                  label={t('Pre-sale ethereum address')}
                  onChange={onChangeEthereumAddress}
                  value={ethereumAddress || ''}
                />
                {(step === Step.ETHAddress) && (
                  <Button.Group>
                    <Button
                      icon='sign-in-alt'
                      isDisabled={!ethereumAddress}
                      label={t('Continue')}
                      onClick={goToStepSign}
                    />
                  </Button.Group>
                )}
              </Card>
            )}
          {(step >= Step.Sign && !isPreclaimed) && (
            <Card>
              <h2>{t('{{step}}. Sign with your ETH address', { replace: { step: isOldClaimProcess ? '2' : '3' } })}</h2>
              {!isOldClaimProcess && (
                <Statement
                  kind={statementKind}
                  systemChain={systemChain}
                />
              )}
              <div>{t('Copy the following string and sign it with the Ethereum account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature object below:')}</div>
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
              <div>{t('Paste the signed message into the field below. The placeholder text is there as a hint to what the message should look like:')}</div>
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
                    label={t('Confirm claim')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              )}
            </Card>
          )}
        </Columar.Column>
        <Columar.Column>
          {accountId && (step >= Step.Claim) && (
            isPreclaimed
              ? (
                <AttestDisplay
                  accountId={accountId}
                  ethereumAddress={ethereumAddress}
                  onSuccess={goToStepAccount}
                  statementKind={statementKind}
                  systemChain={systemChain}
                />
              )
              : (
                <ClaimDisplay
                  accountId={accountId}
                  ethereumAddress={ethereumAddress}
                  ethereumSignature={signature}
                  isOldClaimProcess={isOldClaimProcess}
                  onSuccess={goToStepAccount}
                  statementKind={statementKind}
                />
              )
          )}
        </Columar.Column>
      </Columar>
    </main>
  );
}

export default React.memo(ClaimsApp);
