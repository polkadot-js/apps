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
import generateMnemonic from '@polkadot/util-crypto/mnemonic/generate';
import mnemonicToSecret from '@polkadot/util-crypto/mnemonic/toSecret';
import isMnemonic from '@polkadot/util-crypto/mnemonic/validate';
import randomBytes from '@polkadot/util-crypto/random/asU8a';
import addressEncode from '@polkadot/keyring/address/encode';
import Modal from '@polkadot/ui-app/Modal';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type SeedType = 'bip' | 'raw';

type State = {
  address: string,
  isNameValid: boolean,
  isSeedValid: boolean,
  isPassValid: boolean,
  isValid: boolean,
  name: string,
  password: string,
  seed: string,
  seedType: SeedType,
  showWarning: boolean
};

function formatSeed (seed: string): Uint8Array {
  return isHex(seed)
    ? hexToU8a(seed)
    : u8aFromString(seed.padEnd(32, ' '));
}

function addressFromSeed (seed: string, seedType: SeedType): string {
  const keypair = keypairFromSeed(
    seedType === 'bip'
      ? mnemonicToSecret(seed).subarray(0, 32)
      : formatSeed(seed)
  );

  return addressEncode(
    keypair.publicKey
  );
}

class Creator extends React.PureComponent<Props, State> {
  state: State = { seedType: 'bip' } as State;

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
    const { isNameValid, isPassValid, isSeedValid, name, password, seed, seedType, showWarning } = this.state;

    return (
      <div className='grow'>
        <div>
          <Button.Group>
            <Button
              isPrimary={seedType === 'bip'}
              onClick={this.selectSeedBip39}
              text={t('seed.select.bip39', {
                defaultValue: 'Mnemonic Phrase'
              })}
            />
            <Button
              isPrimary={seedType === 'raw'}
              onClick={this.selectSeedRaw}
              text={t('seed.select.raw', {
                defaultValue: 'Raw Seed'
              })}
            />
          </Button.Group>
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            isError={!isSeedValid}
            label={
              seedType === 'bip'
                ? t('creator.seed.bip', {
                  defaultValue: 'create from the follow mnemonic seed'
                })
                : t('creator.seed.raw', {
                  defaultValue: 'create from the following seed (hex or string)'
                })
            }
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
            isNegative
            onClick={this.onHideWarning}
            text={t('seedWarning.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.onCommit}
            text={t('seedWarning.continue', {
              defaultValue: 'Continue'
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

  generateSeed (seedType: SeedType): State {
    const seed = seedType === 'bip'
      ? generateMnemonic()
      : u8aToHex(randomBytes());
    const address = addressFromSeed(seed, seedType);

    return {
      address,
      seed,
      seedType
    } as State;
  }

  emptyState (): State {
    const { seedType } = this.state;

    return {
      ...this.generateSeed(seedType),
      isNameValid: true,
      isPassValid: false,
      isSeedValid: true,
      isValid: false,
      name: 'new keypair',
      password: '',
      seedType,
      showWarning: false
    };
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { name = prevState.name, password = prevState.password, seed = prevState.seed, seedType = prevState.seedType, showWarning = prevState.showWarning } = newState;
        let address = prevState.address;
        const isNameValid = !!name;
        const isSeedValid = seedType === 'bip'
          ? isMnemonic(seed)
          : (
            isHex(seed)
              ? seed.length === 66
              : seed.length <= 32
          );
        const isPassValid = password.length > 0 && password.length <= 32;

        if (isSeedValid && seed !== prevState.seed) {
          address = addressFromSeed(seed, seedType);
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
          seedType,
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
    const { name, password, seed , seedType } = this.state;
    const pair = seedType === 'bip'
      ? keyring.createAccountMnemonic(seed, password, { name })
      : keyring.createAccount(formatSeed(seed), password, { name });

    this.onHideWarning();
    InputAddress.setLastValue('account', pair.address());

    onBack();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  selectSeedBip39 = (): void => {
    this.setState({ ...this.generateSeed('bip'), seedType: 'bip' });
  }

  selectSeedRaw = (): void => {
    this.setState({ ...this.generateSeed('raw'), seedType: 'raw' });
  }
}

export default translate(Creator);
