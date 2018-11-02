// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressSummary, Button, InputFile, Password } from '@polkadot/ui-app/index';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { decodeAddress } from '@polkadot/keyring';
import { isHex, isObject, u8aToString } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

type Props = I18nProps & {
  onRestoreAccount: () => void
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
      const json = JSON.parse(u8aToString(file));
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
    const { onRestoreAccount } = this.props;
    const { json, password } = this.state;

    if (!json) {
      return;
    }

    try {
      const pair = keyring.restoreAccount(json, password);

      InputAddress.setLastValue('account', pair.address());
      onRestoreAccount();
    } catch (error) {
      this.setState({ isPassValid: false });
      console.error(error);
    }
  }
}

export default translate(Restore);
