/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Compact } from '@polkadot/types';
import { Balance, EcdsaSignature, EthereumAddress } from '@polkadot/types/interfaces';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withApi, withMulti } from '@polkadot/ui-api';
import { Button, Columar, Column, Inset, Tooltip } from '@polkadot/ui-app';
import { InputNumber } from '@polkadot/ui-app/InputNumber';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';
import { u8aToString } from '@polkadot/util';

import ClaimDisplay from './Claim';
import { recoverEthereumSignature } from './util';

import translate from './translate';

enum Step {
  Account = 0,
  Sign = 1,
  Claim = 2,
}

const { Account, Sign, Claim } = Step;

interface Props extends AppProps, ApiProps, I18nProps, TxModalProps {}

interface State extends TxModalState {
  didCopy: boolean;
  ethereumAddress?: EthereumAddress | null;
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
`;

class App extends TxModal<Props, State> {
  public constructor (props: Props) {
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
    const { api, t } = this.props;
    const { accountId, didCopy, ethereumAddress, signature, step } = this.state;

    const payload = `${
      u8aToString(Compact.stripLengthPrefix(api.consts.claims.prefix.toU8a(true)))
    }${
      (accountId || '').toString()
    }`;

    return (
      <main>
        <header />
        <h1>
          {t('claim your{{unit}} tokens', { replace: { unit: ` ${InputNumber.units}` || '' } })}
        </h1>
        <Columar>
          <Column>
            <Inset withBottomMargin>
              <h3>{t('1. Select your Polkadot account')}</h3>
              {this.renderInputAccount()}
              {(step === Account) && (
                <Button.Group>
                  <Button
                    isPrimary
                    onClick={this.setStep(Sign)}
                    label={t('Continue')}
                  />
                </Button.Group>
              )}
            </Inset>
            {(step >= Sign && !!accountId) && (
              <Inset withBottomMargin>
                <h3>{t('2. Sign ETH transaction')}</h3>
                <CopyToClipboard
                  onCopy={this.onCopy}
                  text={payload}
                >
                  <Payload
                    data-for={`tx-payload`}
                    data-tip
                  >
                    {`${
                      u8aToString(Compact.stripLengthPrefix(api.consts.claims.prefix.toU8a(true)))
                    }${
                      accountId.toString()
                    }`}
                  </Payload>
                </CopyToClipboard>
                <Tooltip
                  place='right'
                  text={t(didCopy ? 'copied' : 'click to copy')}
                  trigger='tx-payload'
                />
                <div>
                  {t('Copy the above string and sign an Ethereum transaction with the account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature below')}
                  :
                </div>
                <Signature
                  onChange={this.onChangeSignature}
                  rows={10}
                />
                {(step === Sign) && (
                  <Button.Group>
                    <Button
                      isDisabled={!accountId || !signature}
                      isPrimary
                      onClick={this.setStep(Claim)}
                      label={t('Confirm claim')}
                    />
                  </Button.Group>
                )}
              </Inset>
            )}
          </Column>
          <Column showEmptyText={false}>
            {(step >= Claim) && (
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
          step > Account
            ? this.defaultState
            : {}
        ),
        accountId
      };
    });
  }

  protected onChangeSignature = (event: React.SyntheticEvent<Element>): void => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    this.setState(({ step }: State): Pick<State, never> => {
      return {
        ...(
          step > Sign
            ? { step: Sign }
            : {}
        ),
        ...((): Pick<State, never> => {
          try {
            const { ethereumAddress, signature } = recoverEthereumSignature(signatureJson);

            return {
              ethereumAddress,
              signature
            };
          } catch (e) {
            console.error(e);
          }

          return {
            ethereumAddress: null,
            signature: null
          };
        })()
      };
    });
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
