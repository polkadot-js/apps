// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressSummary, Button, Dropdown, Input, Modal, Password } from '@polkadot/ui-app/index';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicToSeed, mnemonicValidate, naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';
import { encodeAddress } from '@polkadot/keyring';
import keyring from '@polkadot/ui-keyring/index';

import translate from './translate';

const BipWorker = require('worker-loader?name=[name].[hash:8].js!./bipWorker');

type Props = I18nProps & {
  onCreateAccount: () => void
};

type SeedType = 'bip' | 'raw';

type State = {
  address: string,
  isBipBusy: boolean,
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
  bipWorker: any;
  state: State = { seedType: 'bip' } as State;

  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.bipWorker = new BipWorker();
    this.bipWorker.onmessage = (event: MessageEvent) => {
      const { address, seed } = event.data;

      this.setState({
        address,
        isBipBusy: false,
        seed
      });
    };
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
    const { isBipBusy, isNameValid, isPassValid, isSeedValid, name, password, seed, seedOptions, seedType, showWarning } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            className='full'
            isAction
            isDisabled={isBipBusy}
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
            placeholder={
              isBipBusy
                ? t('creator.seed.bipBusy', {
                  defaultValue: 'Generating Mnemeonic seed'
                })
                : null
            }
            value={isBipBusy ? '' : seed}
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
    if (seedType === 'bip') {
      this.bipWorker.postMessage('create');

      return {
        isBipBusy: true,
        seed: ''
      } as State;
    }

    const seed = u8aToHex(randomAsU8a());
    const address = addressFromSeed(seed, seedType);

    return {
      address,
      isBipBusy: false,
      seed
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
        const { isBipBusy = prevState.isBipBusy, name = prevState.name, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning } = newState;
        let address = prevState.address;
        const isNameValid = !!name;
        const isSeedValid = seedType === 'bip'
          ? mnemonicValidate(seed)
          : (
            isHex(seed)
              ? seed.length === 66
              : seed.length <= 32
          );
        const isPassValid = keyring.isPassValid(password);

        if (isSeedValid && seed !== prevState.seed) {
          address = addressFromSeed(seed, seedType);
        }

        return {
          address,
          isBipBusy,
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
    const { onCreateAccount } = this.props;
    const { name, password, seed, seedType } = this.state;
    const pair = seedType === 'bip'
      ? keyring.createAccountMnemonic(seed, password, { name })
      : keyring.createAccount(formatSeed(seed), password, { name });

    this.onHideWarning();

    InputAddress.setLastValue('account', pair.address());

    onCreateAccount();
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
