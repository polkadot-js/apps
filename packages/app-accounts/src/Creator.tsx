// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import Password from '@polkadot/ui-app/Password';
import keyring from '@polkadot/ui-keyring/index';
import isHex from '@polkadot/util/is/hex';
import hexToU8a from '@polkadot/util/hex/toU8a';
import u8aFromString from '@polkadot/util/u8a/fromString';
import u8aToHex from '@polkadot/util/u8a/toHex';
import keypairFromSeed from '@polkadot/util-crypto/nacl/keypair/fromSeed';
import randomBytes from '@polkadot/util-crypto/random/asU8a';
import addressEncode from '@polkadot/util-keyring/address/encode';
import Modal from '@polkadot/ui-app/Modal';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  address: string,
  isNameValid: boolean,
  isSeedValid: boolean,
  isPassValid: boolean,
  isValid: boolean,
  name: string,
  password: string,
  seed: string,
  showWarning: boolean
};

function formatSeed (seed: string): Uint8Array {
  return isHex(seed)
    ? hexToU8a(seed)
    : u8aFromString(seed.padEnd(32, ' '));
}

function addressFromSeed (seed: string): string {
  return addressEncode(
    keypairFromSeed(
      formatSeed(seed)
    ).publicKey
  );
}

class Creator extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render () {
    const { address, isSeedValid } = this.state;

    return (
      <div className='accounts--Creator'>
        <div className='ui--grid'>
          <AddressSummary
            className='shrink'
            value={
              isSeedValid
                ? address
                : ''
            }
          />
          {this.renderInput()}
        </div>
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { isValid } = this.state;

    return (
      <Button.Group>
        <Button
          onClick={this.onDiscard}
          text={t('creator.discard', {
            defaultValue: 'Reset'
          })}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          onClick={this.onShowWarning}
          text={t('creator.save', {
            defaultValue: 'Save'
          })}
        />
      </Button.Group>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { isNameValid, isPassValid, isSeedValid, name, password, seed, showWarning } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            className='full'
            isError={!isSeedValid}
            label={t('creator.seed', {
              defaultValue: 'create from the following seed (hex or string)'
            })}
            onChange={this.onChangeSeed}
            value={seed}
          />
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            isError={!isNameValid}
            label={t('creator.name', {
              defaultValue: 'name the account'
            })}
            onChange={this.onChangeName}
            value={name}
          />
        </div>
        <div className='ui--row'>
          <Password
            className='full'
            isError={!isPassValid}
            label={t('creator.password', {
              defaultValue: 'encrypt it using the password'
            })}
            onChange={this.onChangePass}
            value={password}
          />
        </div>
        <Modal
          dimmer='inverted'
          open={showWarning}
        >
          {this.renderModalContent()}
          {this.renderModalButtons()}
        </Modal>
      </div>
    );
  }

  renderModalButtons () {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isPrimary
            onClick={this.onCommit}
            text={t('seedWarning.continue', {
              defaultValue: 'Continue'
            })}
          />
          <Button.Or />
          <Button
            isNegative
            onClick={this.onHideWarning}
            text={t('seedWarning.cancel', {
              defaultValue: 'Cancel'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderModalContent () {
    const { t } = this.props;

    return [
      <Modal.Header key='header'>
        {t('seedWarning.header', {
          defaultValue: 'Warning'
        })}
      </Modal.Header>,
      <Modal.Content key='content'>
        {t('seedWarning.content', {
          defaultValue: 'Before you continue, make sure you have properly backed up your seed in a safe place as it is needed to restore your account.'
        })}
      </Modal.Content>
    ];
  }

  emptyState (): State {
    const seed = u8aToHex(randomBytes());
    const address = addressFromSeed(seed);

    return {
      address,
      isNameValid: true,
      isPassValid: false,
      isSeedValid: true,
      isValid: false,
      name: 'new keypair',
      password: '',
      seed,
      showWarning: false
    };
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { name = prevState.name, password = prevState.password, seed = prevState.seed, showWarning = prevState.showWarning } = newState;
        let address = prevState.address;
        const isNameValid = !!name;
        const isSeedValid = isHex(seed)
          ? seed.length === 66
          : seed.length <= 32;
        const isPassValid = password.length > 0 && password.length <= 32;

        if (isSeedValid && seed !== prevState.seed) {
          address = addressFromSeed(seed);
        }

        return {
          address,
          isNameValid,
          isPassValid,
          isSeedValid,
          isValid: isNameValid && isPassValid && isSeedValid,
          name,
          password,
          seed,
          showWarning
        };
      }
    );
  }

  onChangeSeed = (seed: string): void => {
    this.nextState({ seed } as State);
  }

  onChangeName = (name: string): void => {
    this.nextState({ name } as State);
  }

  onChangePass = (password: string): void => {
    this.nextState({ password } as State);
  }

  onShowWarning = (): void => {
    this.nextState({ showWarning: true } as State);
  }

  onHideWarning = (): void => {
    this.nextState({ showWarning: false } as State);
  }

  onCommit = (): void => {
    const { onBack } = this.props;
    const { name, password, seed } = this.state;
    const pair = keyring.createAccount(
      formatSeed(seed), password, { name }
    );

    this.onHideWarning();
    InputAddress.setLastValue('account', pair.address());

    onBack();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);
