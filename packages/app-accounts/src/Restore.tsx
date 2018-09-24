// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import InputFile from '@polkadot/ui-app/InputFile';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import Password from '@polkadot/ui-app/Password';
import createPair from '@polkadot/util-keyring/pair';
import decodeAddress from '@polkadot/util-keyring/address/decode';
import isHex from '@polkadot/util/is/hex';
import isObject from '@polkadot/util/is/object';
import hexToU8a from '@polkadot/util/hex/toU8a';
import u8aToUtf8 from '@polkadot/util/u8a/toUtf8';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  isFileValid: boolean,
  isPassValid: boolean,
  json: KeyringPair$Json | null,
  password: string
};

class Restore extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isFileValid: false,
      isPassValid: false,
      json: null,
      password: ''
    };
  }

  render () {
    const { className, t } = this.props;
    const { isFileValid, isPassValid, json } = this.state;

    return (
      <div className={classes('accounts--Restore', className)}>
        <div className='ui--grid'>
          <AddressSummary
            className='shrink'
            value={
              isFileValid && json
                ? json.address
                : null
              }
          />
          {this.renderInput()}
        </div>
        <Button.Group>
        <Button
          isDisabled={!isFileValid || !isPassValid}
          isPrimary
          onClick={this.onSave}
          text={t('restore.save', {
            defaultValue: 'Restore'
          })}
        />
      </Button.Group>
      </div>
    );
  }

  private renderInput () {
    const { t } = this.props;
    const { isFileValid, isPassValid, password } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Password
            className='full'
            isError={!isPassValid}
            label={t('restore.password', {
              defaultValue: 'decrypt keyfile using the password'
            })}
            onChange={this.onChangePass}
            value={password}
          />
        </div>
        <div className='ui--row'>
          <InputFile
            acceptedFormats='.json'
            className='full'
            isError={!isFileValid}
            label={t('restore.json', {
              defaultValue: 'previously backed-up json keyfile'
            })}
            onChange={this.onChangeFile}
            withLabel
          />
        </div>
      </div>
    );
  }

  private onChangeFile = (file: Uint8Array): void => {
    try {
      const json = JSON.parse(u8aToUtf8(file));
      const isFileValid = decodeAddress(json.address).length === 32 &&
        isHex(json.encoded) &&
        isObject(json.meta) &&
        json.encoding.content === 'pkcs8';

      this.setState({
        isFileValid,
        json
      });
    } catch (error) {
      this.setState({
        isFileValid: false,
        json: null
      });
    }
  }

  private onChangePass = (password: string): void => {
    this.setState({
      isPassValid: this.validatePass(password),
      password
    });
  }

  private onSave = (): void => {
    const { onBack } = this.props;
    const { json, password } = this.state;

    if (!json) {
      return;
    }

    try {
      const pair = createPair(
        {
          publicKey: decodeAddress(json.address),
          secretKey: new Uint8Array()
        },
        json.meta,
        hexToU8a(json.encoded)
      );

      pair.decodePkcs8(password);
      pair.lock();

      keyring.addAccountPair(pair, password);
      InputAddress.setLastValue('account', pair.address());
      onBack();
    } catch (error) {
      this.setState({ isPassValid: false });
    }
  }

  private validatePass (password: string): boolean {
    return password.length > 0 && password.length <= 32;
  }
}

export default translate(Restore);
