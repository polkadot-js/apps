// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressSummary, Button, Dropdown, Input, InputAddress, Modal, Password } from '@polkadot/ui-app/index';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate, naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';
import { encodeAddress } from '@polkadot/keyring';
import keyring from '@polkadot/ui-keyring/index';

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
  seedOptions: Array<{ value: SeedType, text: string }>,
  seedType: SeedType,
  showWarning: boolean
};

function formatSeed (seed: string): Uint8Array {
  return isHex(seed)
    ? hexToU8a(seed)
    : stringToU8a(seed.padEnd(32, ' '));
}

function addressFromSeed (seed: string, seedType: SeedType): string {
  const keypair = naclKeypairFromSeed(
    seedType === 'bip'
      ? mnemonicToSeed(seed)
      : formatSeed(seed)
  );

  return encodeAddress(
    keypair.publicKey
  );
}

class Creator extends React.PureComponent<Props, State> {
  state: State = { seedType: 'bip' } as State;

  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      ...this.emptyState(),
      seedOptions: [
        { value: 'bip', text: t('seedType.bip', { defaultValue: 'Mnemonic' }) },
        { value: 'raw', text: t('seedType.raw', { defaultValue: 'Raw seed' }) }
      ]
    };
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
    const { isNameValid, isPassValid, isSeedValid, name, password, seed, seedOptions, seedType, showWarning } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            className='full'
            isAction
            isError={!isSeedValid}
            label={
              seedType === 'bip'
                ? t('creator.seed.bip', {
                  defaultValue: 'create from the following mnemonic seed'
                })
                : t('creator.seed.raw', {
                  defaultValue: 'create from the following seed (hex or string)'
                })
            }
            onChange={this.onChangeSeed}
            value={seed}
          >
            <Dropdown
              isButton
              defaultValue={seedType}
              onChange={this.selectSeedType}
              options={seedOptions}
            />
          </Input>
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

  private generateSeed (seedType: SeedType): State {
    const seed = seedType === 'bip'
      ? mnemonicGenerate()
      : u8aToHex(randomAsU8a());
    const address = addressFromSeed(seed, seedType);

    return {
      address,
      seed,
      seedType
    } as State;
  }

  private emptyState (): State {
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

  private nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { name = prevState.name, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning } = newState;
        let address = prevState.address;
        const isNameValid = !!name;
        const isSeedValid = seedType === 'bip'
          ? mnemonicValidate(seed)
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
          seedOptions,
          seedType,
          showWarning
        };
      }
    );
  }

  private onChangeSeed = (seed: string): void => {
    this.nextState({ seed } as State);
  }

  private onChangeName = (name: string): void => {
    this.nextState({ name } as State);
  }

  private onChangePass = (password: string): void => {
    this.nextState({ password } as State);
  }

  private onShowWarning = (): void => {
    this.nextState({ showWarning: true } as State);
  }

  private onHideWarning = (): void => {
    this.nextState({ showWarning: false } as State);
  }

  private onCommit = (): void => {
    const { onBack } = this.props;
    const { name, password, seed , seedType } = this.state;
    const pair = seedType === 'bip'
      ? keyring.createAccountMnemonic(seed, password, { name })
      : keyring.createAccount(formatSeed(seed), password, { name });

    this.onHideWarning();
    InputAddress.setLastValue('account', pair.address());

    onBack();
  }

  private onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  private selectSeedType = (seedType: SeedType): void => {
    this.setState({
      ...this.generateSeed(seedType),
      seedType
    });
  }
}

export default translate(Creator);
