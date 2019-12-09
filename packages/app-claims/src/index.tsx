/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withApi, withMulti } from '@polkadot/react-api';
import { Button, Card, Columar, Column, InputAddress, Tooltip } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import ClaimDisplay from './Claim';
import { recoverFromJSON } from './util';

import translate from './translate';

enum Step {
  Account = 0,
  Sign = 1,
  Claim = 2,
}

interface Props extends AppProps, ApiProps, I18nProps, TxModalProps {}

interface State extends TxModalState {
  didCopy: boolean;
  ethereumAddress: EthereumAddress | null;
  claim?: Balance | null;
  signature?: EcdsaSignature | null;
  step: Step;
}

const Payload = styled.pre`
  cursor: copy;
  font-family: monospace;
  border: 1px dashed #c2c2c2;
  background: #fafafa;
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

  &:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

class App extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      claim: null,
      didCopy: false,
      ethereumAddress: null,
      signature: null,
      step: 0
    };
    this.state = this.defaultState;
  }

  public componentDidUpdate (): void {
    if (this.state.didCopy) {
      setTimeout((): void => {
        this.setState({ didCopy: false });
      }, 1000);
    }
  }

  public render (): React.ReactNode {
    const { api, systemChain = '', t } = this.props;
    const { accountId, didCopy, ethereumAddress, signature, step } = this.state;

    const payload = accountId
      ? (
        u8aToString(api.consts.claims.prefix.toU8a(true)) +
        u8aToHex(decodeAddress(accountId), -1, false)
      )
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
                defaultValue={this.state.accountId}
                help={t('The account you want to claim to.')}
                label={t('claim to account')}
                onChange={this.onChangeAccount}
                type='all'
              />
              {(step === Step.Account) && (
                <Button.Group>
                  <Button
                    icon='sign-in'
                    isPrimary
                    onClick={this.setStep(Step.Sign)}
                    label={t('Continue')}
                  />
                </Button.Group>
              )}
            </Card>
            {(step >= Step.Sign && !!accountId) && (
              <Card>
                <h3>{t('2. Sign ETH transaction')}</h3>
                <CopyToClipboard
                  onCopy={this.onCopy}
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
                  onChange={this.onChangeSignature}
                  placeholder='{\n  "address": "0x ...",\n  "msg": "Pay KSMs to the Kusama account: ...",\n  "sig": "0x ...",\n  "version": "2"\n}'
                  rows={10}
                />
                {(step === Step.Sign) && (
                  <Button.Group>
                    <Button
                      icon='sign-in'
                      isDisabled={!accountId || !signature}
                      isPrimary
                      onClick={this.setStep(Step.Claim)}
                      label={t('Confirm claim')}
                    />
                  </Button.Group>
                )}
              </Card>
            )}
          </Column>
          <Column showEmptyText={false}>
            {(step >= Step.Claim) && (
              <ClaimDisplay
                button={this.renderTxButton()}
                ethereumAddress={ethereumAddress}
              />
            )}
          </Column>
        </Columar>
      </main>
    );
  }

  protected isDisabled = (): boolean => {
    const { accountId, signature } = this.state;

    return !accountId || !signature;
  }

  protected isUnsigned = (): boolean => true;

  protected submitLabel = (): React.ReactNode => this.props.t('Redeem');

  protected txMethod = (): string => 'claims.claim';

  protected txParams = (): [string | null, EcdsaSignature | null] => {
    const { accountId, signature } = this.state;

    return [
      accountId ? accountId.toString() : null,
      signature || null
    ];
  }

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState(({ step }: State): Pick<State, never> => {
      return {
        ...(
          step > Step.Account
            ? this.defaultState
            : {}
        ),
        accountId
      };
    });
  }

  protected onChangeSignature = (event: React.SyntheticEvent<Element>): void => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    this.setState(({ step }: State): Pick<State, never> => ({
      ...(
        step > Step.Sign
          ? { step: Step.Sign }
          : {}
      ),
      ...recoverFromJSON(signatureJson)
    }));
  }

  private onCopy = (): void => {
    this.setState({ didCopy: true });
  }

  private setStep = (step: Step): () => void =>
    (): void => {
      this.setState({ step });
    }
}

export default withMulti(
  App,
  translate,
  withApi
);
