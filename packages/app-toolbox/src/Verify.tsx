// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React from 'react';
import { Dropdown, Icon, Input, InputAddress, Static } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto';

import translate from './translate';

type CryptoTypes = KeypairType | 'unknown';

type CryptoOption = {
  text: string,
  value: string
};

type State = {
  currentPublicKey: Uint8Array | null,
  cryptoOptions: Array<CryptoOption>,
  cryptoType: CryptoTypes,
  defaultPublicKey?: Uint8Array,
  data: string,
  isHexData: boolean,
  isValidAddress: boolean,
  isValidSignature: boolean,
  isValid: boolean,
  signature: string
};

class Verify extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = this.props;
    const pairs = keyring.getPairs();
    const currentPair = pairs[0];
    const currentPublicKey = currentPair
      ? currentPair.publicKey
      : null;

    this.state = {
      cryptoOptions: [{ value: 'unknown', text: t('Crypto not detected') }].concat(uiSettings.availableCryptos),
      cryptoType: 'unknown',
      currentPublicKey,
      defaultPublicKey: currentPublicKey || void 0,
      data: '',
      isHexData: false,
      isValidAddress: !!currentPair,
      isValidSignature: false,
      isValid: false,
      signature: ''
    };
  }

  render () {
    const { t } = this.props;
    const { cryptoOptions, cryptoType, data, isHexData } = this.state;

    return (
      <div className='toolbox--Verify'>
        {this.renderAddress()}
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t('The data that was signed. This is used in combination with the signature for the verification. It can either be hex or a string.')}
            label={t('using the following data')}
            onChange={this.onChangeData}
            value={data}
          />
        </div>
        {this.renderSignature()}
        <div className='ui--row'>
          <Dropdown
            defaultValue={cryptoType}
            help={t('Cryptography used to create this signature. It is auto-detected on valid signatures.')}
            isDisabled
            label={t('signature crypto type')}
            options={cryptoOptions}
          />
          <Static
            className='medium'
            help={t('Detection on the input string to determine if it is hex or non-hex.')}
            label={t('hex input data')}
            value={
              isHexData
                ? t('Yes')
                : t('No')
            }
          />
        </div>
      </div>
    );
  }

  private renderAddress () {
    const { t } = this.props;
    const { defaultPublicKey, isValidAddress } = this.state;

    return (
      <div className='ui--row'>
        <InputAddress
          className='full'
          defaultValue={defaultPublicKey}
          help={t('The account that signed the input')}
          isError={!isValidAddress}
          isInput
          label={t('verify using address')}
          onChange={this.onChangeAddress}
        />
      </div>
    );
  }

  private renderSignature () {
    const { t } = this.props;
    const { isValid, isValidSignature, signature } = this.state;

    return (
      <div className='ui--row'>
        <Input
          className='full'
          icon={
            <Icon
              color={isValid ? 'green' : (isValidSignature ? 'red' : void 0)}
              name={isValid ? 'check circle' : (isValidSignature ? 'exclamation circle' : 'help circle')}
              size='big'
            />
          }
          isError={!isValidSignature}
          help={t('The signature as by the account being checked, supplied as a hex-formatted string.')}
          label={t('the supplied signature')}
          onChange={this.onChangeSignature}
          value={signature}
        />
      </div>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { isHexData = prevState.isHexData, isValidAddress = prevState.isValidAddress, isValidSignature = prevState.isValidSignature, currentPublicKey = prevState.currentPublicKey, data = prevState.data, signature = prevState.signature } = newState;
        let cryptoType: CryptoTypes = 'unknown';
        let isValid = isValidAddress && isValidSignature;

        // We cannot just use the keyring verify since it may be an address. So here we first check
        // for ed25519, if not valid, we try against sr25519 - if neither are valid, well, we have
        // not been able to validate the signature
        if (isValid && currentPublicKey) {
          let isValidSr = false;
          let isValidEd = false;

          try {
            isValidEd = naclVerify(data, signature, currentPublicKey);
          } catch (error) {
            // do nothing, already set to false
          }

          if (isValidEd) {
            cryptoType = 'ed25519';
          } else {
            try {
              isValidSr = schnorrkelVerify(data, signature, currentPublicKey);
            } catch (error) {
              // do nothing, already set to false
            }

            if (isValidSr) {
              cryptoType = 'sr25519';
            } else {
              isValid = false;
            }
          }
        }

        return {
          cryptoType,
          isHexData,
          isValid,
          isValidAddress,
          isValidSignature,
          currentPublicKey,
          data,
          signature
        } as State;
      }
    );
  }

  private onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData } as State);
  }

  private onChangeSignature = (signature: string): void => {
    const isValidSignature = isHex(signature) && signature.length === 130;

    this.nextState({ signature, isValidSignature } as State);
  }

  private onChangeAddress = (accountId: string): void => {
    let currentPublicKey;

    try {
      currentPublicKey = keyring.decodeAddress(accountId);
    } catch (err) {
      console.error(err);
    }

    const isValidAddress = currentPublicKey && currentPublicKey.length === 32;

    this.nextState({ currentPublicKey, isValidAddress } as State);
  }
}

export default translate(Verify);
