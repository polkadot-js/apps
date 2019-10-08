// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React from 'react';
import { Dropdown, Icon, Input, InputAddress, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto';
import styled from 'styled-components';

import translate from './translate';

type CryptoTypes = KeypairType | 'unknown';

interface CryptoOption {
  text: string;
  value: string;
}

interface State {
  currentPublicKey: Uint8Array | null;
  cryptoOptions: CryptoOption[];
  cryptoType: CryptoTypes;
  defaultPublicKey?: Uint8Array;
  data: string;
  isHexData: boolean;
  isValidAddress: boolean;
  isValidSignature: boolean;
  isValid: boolean;
  signature: string;
}

const AlignedIcon = styled(Icon)`
  &&&::before {
    position: relative;
    left: 0.88rem;
    top: 1rem; 
    width: 32px;
    height: 32px;
    font-size: 32px;
    background: white !important;
    border-radius: 50%;
  }
  
  &&&.big.icon {
    font-size: 32px;
  }
`;

class Verify extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { t } = this.props;
    const pairs = keyring.getPairs();
    const currentPair = pairs[0];
    const currentPublicKey = currentPair
      ? currentPair.publicKey
      : null;

    this.state = {
      cryptoOptions: [{ value: 'unknown', text: t('Crypto not detected') }].concat(uiSettings.availableCryptos as any[]),
      cryptoType: 'unknown',
      currentPublicKey,
      defaultPublicKey: currentPublicKey || undefined,
      data: '',
      isHexData: false,
      isValidAddress: !!currentPair,
      isValidSignature: false,
      isValid: false,
      signature: ''
    };
  }

  public render (): React.ReactNode {
    const { t } = this.props;
    const { cryptoOptions, cryptoType, data, defaultPublicKey, isHexData, isValid, isValidAddress, isValidSignature, signature } = this.state;

    return (
      <div className='toolbox--Verify'>
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
        <div className='ui--row'>
          <div className="ui--AlignedIconContainer" style={{ position: 'absolute', zIndex: 1 }}>
            <AlignedIcon
              color={isValid ? 'green' : (isValidSignature ? 'red' : undefined)}
              name={isValid ? 'check circle' : (isValidSignature ? 'exclamation circle' : 'help circle')}
              size="big"
            />
          </div>
          <Input
            className='full'
            isError={!isValidSignature}
            help={t('The signature as by the account being checked, supplied as a hex-formatted string.')}
            label={t('the supplied signature')}
            onChange={this.onChangeSignature}
            value={signature}
          />
        </div>
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

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): Pick<State, never> => {
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
        };
      }
    );
  }

  private onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData });
  }

  private onChangeSignature = (signature: string): void => {
    const isValidSignature = isHex(signature) && signature.length === 130;

    this.nextState({ signature, isValidSignature });
  }

  private onChangeAddress = (accountId: string | null): void => {
    let currentPublicKey;

    try {
      currentPublicKey = keyring.decodeAddress(accountId || '');
    } catch (err) {
      console.error(err);
    }

    const isValidAddress = currentPublicKey && currentPublicKey.length === 32;

    this.nextState({ currentPublicKey, isValidAddress });
  }
}

export default translate(Verify);
