// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { ModalProps } from '../types';

import React from 'react';
import { AddressRow, Button, InputFile, Modal, Password, TxComponent } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { isHex, isObject, u8aToString } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = ModalProps & I18nProps;

type State = {
  address: string | null,
  isFileValid: boolean,
  isPassValid: boolean,
  json: KeyringPair$Json | null,
  password: string
};

class Import extends TxComponent<Props, State> {
  state: State = {
    address: null,
    isFileValid: false,
    isPassValid: false,
    json: null,
    password: ''
  };

  render () {
    const { onClose, t } = this.props;
    const { isFileValid, isPassValid } = this.state;

    return (
      <Modal
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Add an account via seed')}</Modal.Header>
        {this.renderInput()}
        <Modal.Actions>
          <Button.Group>
            <Button
              label={t('Cancel')}
              onClick={onClose}
            />
            <Button.Or />
            <Button
              isDisabled={!isFileValid || !isPassValid}
              isPrimary
              onClick={this.onSave}
              label={t('Restore')}
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderInput () {
    const { t } = this.props;
    const { address, isFileValid, isPassValid, json, password } = this.state;
    const acceptedFormats = ['application/json', 'text/plain'].join(', ');

    return (
      <Modal.Content>
        <AddressRow
          defaultName={isFileValid && json ? json.meta.name : null}
          value={isFileValid && address ? address : null}
        >
          <InputFile
            accept={acceptedFormats}
            className='full'
            help={t('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
            isError={!isFileValid}
            label={t('backup file')}
            onChange={this.onChangeFile}
            withLabel
          />
          <Password
            autoFocus
            className='full'
            help={t('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
            isError={!isPassValid}
            label={t('password')}
            onChange={this.onChangePass}
            onEnter={this.submit}
            value={password}
          />
        </AddressRow>
      </Modal.Content>
    );
  }

  private onChangeFile = (file: Uint8Array): void => {
    try {
      const json = JSON.parse(u8aToString(file));
      const publicKey = keyring.decodeAddress(json.address, true);
      const address = keyring.encodeAddress(publicKey);
      const isFileValid = publicKey.length === 32 && isHex(json.encoded) && isObject(json.meta) && (
        Array.isArray(json.encoding.content)
          ? json.encoding.content[0] === 'pkcs8'
          : json.encoding.content === 'pkcs8'
      );

      this.setState({
        address,
        isFileValid,
        json
      });
    } catch (error) {
      this.setState({
        address: null,
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
    const { onClose, onStatusChange, t } = this.props;
    const { json, password } = this.state;

    if (!json) {
      return;
    }

    const status = { action: 'restore' } as ActionStatus;

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
      onClose();
    }
  }
}

export default translate(Import);
