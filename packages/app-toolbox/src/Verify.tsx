// Copyright 2017-2018 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';

import React from 'react';

import Icon from '@polkadot/ui-app/Icon';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import Static from '@polkadot/ui-app/Static';
import keyring from '@polkadot/ui-keyring/index';
import hexToU8a from '@polkadot/util/hex/toU8a';
import isHex from '@polkadot/util/is/hex';
import u8aFromString from '@polkadot/util/u8a/fromString';
import naclVerify from '@polkadot/util-crypto/nacl/verify';

import translate from './translate';

type State = {
  currentPublicKey: Uint8Array | null,
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

    const pairs = keyring.getPairs();
    const currentPair = pairs[0];
    const currentPublicKey = currentPair
      ? currentPair.publicKey()
      : null;

    this.state = {
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
    return (
      <div className='toolbox--Verify'>
        {this.renderInput()}
        {this.renderAddress()}
        {this.renderSignature()}
      </div>
    );
  }

  renderAddress () {
    const { t } = this.props;
    const { defaultPublicKey, isValidAddress } = this.state;

    return (
      <div className='ui--row'>
        <InputAddress
          className='full'
          defaultValue={defaultPublicKey}
          isError={!isValidAddress}
          isInput
          label={t('verify.account', {
            defaultValue: 'verify using address'
          })}
          onChange={this.onChangeAddress}
        />
      </div>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { data, isHexData } = this.state;

    return (
      <div className='ui--row'>
        <Input
          className='large'
          label={t('verify.data', {
            defaultValue: 'using the following data (hex or string)'
          })}
          onChange={this.onChangeData}
          value={data}
        />
        <Static
          className='small'
          label={t('verify.isHex', {
            defaultValue: 'hex input data'
          })}
          value={
            isHexData
              ? t('verify.isHex.yes', {
                defaultValue: 'Yes'
              })
              : t('verify.isHex.no', {
                defaultValue: 'No'
              })
          }
        />
      </div>
    );
  }

  renderSignature () {
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
          label={t('verify.signature', {
            defaultValue: 'checking the supplied signature'
          })}
          onChange={this.onChangeSignature}
          value={signature}
        />
      </div>
    );
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { isHexData = prevState.isHexData, isValidAddress = prevState.isValidAddress, isValidSignature = prevState.isValidSignature, currentPublicKey = prevState.currentPublicKey, data = prevState.data, signature = prevState.signature } = newState;

        let isValid = isValidAddress && isValidSignature;

        if (isValid && currentPublicKey) {
          isValid = naclVerify(
            isHexData
              ? hexToU8a(data)
              : u8aFromString(data),
            hexToU8a(signature),
            currentPublicKey
          );
        }

        return {
          isHexData,
          isValid,
          isValidAddress,
          isValidSignature,
          currentPublicKey,
          data,
          signature
        };
      }
    );
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData } as State);
  }

  onChangeSignature = (signature: string): void => {
    const isValidSignature = isHex(signature) && signature.length === 130;

    this.nextState({ signature, isValidSignature } as State);
  }

  onChangeAddress = (currentPublicKey: Uint8Array): void => {
    const isValidAddress = currentPublicKey && currentPublicKey.length === 32;

    this.nextState({ currentPublicKey, isValidAddress } as State);
  }
}

export default translate(Verify);
