// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { AddressSummary, Button, InputFile, Password } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { isHex, isObject, u8aToString } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

type Props = ComponentProps & I18nProps;

type State = {
  isFileValid: boolean,
  isPassValid: boolean,
  json: KeyringPair$Json | null,
  password: string
};

class Restore extends React.PureComponent<Props, State> {
  state: State = {
    isFileValid: false,
    isPassValid: false,
    json: null,
    password: ''
  };

  render () {
    const { t } = this.props;
    const { isFileValid, isPassValid, json } = this.state;

    return (
      <div className='accounts--Restore'>
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
          label={t('Restore')}
        />
      </Button.Group>
      </div>
    );
  }

  private renderInput () {
    const { t } = this.props;
    const { isFileValid, isPassValid, password } = this.state;
    const acceptedFormats = ['application/json', 'text/plain'].join(', ');

    return (
      <div className='grow'>
        <div className='ui--row'>
          <InputFile
            accept={acceptedFormats}
            className='full'
            help={t('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
            isError={!isFileValid}
            label={t('backup file')}
            onChange={this.onChangeFile}
            withLabel
          />
        </div>
        <div className='ui--row'>
          <Password
            autoFocus
            className='full'
            help={t('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
            isError={!isPassValid}
            label={t('password')}
            onChange={this.onChangePass}
            value={password}
          />
        </div>
      </div>
    );
  }

  private onChangeFile = (file: Uint8Array): void => {
    try {
      const json = JSON.parse(u8aToString(file));
      const isFileValid = keyring.decodeAddress(json.address).length === 32 && isHex(json.encoded) && isObject(json.meta) && (
        Array.isArray(json.encoding.content)
          ? json.encoding.content[0] === 'pkcs8'
          : json.encoding.content === 'pkcs8'
      );

      this.setState({
        isFileValid,
        json
      });
    } catch (error) {
      this.setState({
        isFileValid: false,
        json: null
      });
      console.error(error);
    }
  }

  private onChangePass = (password: string): void => {
    this.setState({
      isPassValid: keyring.isPassValid(password),
      password
    });
  }

  private onSave = (): void => {
    const { basePath, onStatusChange, t } = this.props;
    const { json, password } = this.state;

    if (!json) {
      return;
    }

    const status = {
      action: 'restore'
    } as ActionStatus;

    try {
      const pair = keyring.restoreAccount(json, password);

      status.status = pair ? 'success' : 'error';
      status.account = pair.address();
      status.message = t('account restored');

      InputAddress.setLastValue('account', pair.address());
    } catch (error) {
      this.setState({ isPassValid: false });

      status.status = 'error';
      status.message = error.message;
      console.error(error);
    }

    onStatusChange(status);

    if (status.status !== 'error') {
      window.location.hash = basePath;
    }
  }
}

export default translate(Restore);
