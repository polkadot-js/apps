// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { AddressSummary, Button, Dropdown, Input, Modal, Password } from '@polkadot/ui-app/index';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicToSeed, mnemonicValidate, naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';
import FileSaver from 'file-saver';

const BipWorker = require('worker-loader?name=[name].[hash:8].js!./bipWorker');

type Props = I18nProps & {
  onStatusChange: (status: ActionStatus) => void,
  onCreateAccount: () => void,
  passthrough: string | null
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

function isHexSeed (seed: string): boolean {
  return isHex(seed) && seed.length === 66;
}

function rawValidate (seed: string): boolean {
  return seed.length <= 32 || isHexSeed(seed);
}

function rawToSeed (seed: string): Uint8Array {
  return isHexSeed(seed)
    ? hexToU8a(seed)
    : stringToU8a(seed.padEnd(32, ' '));
}

function addressFromSeed (seed: string, seedType: SeedType): string {
  const keypair = naclKeypairFromSeed(
    seedType === 'bip'
      ? mnemonicToSeed(seed)
      : rawToSeed(seed)
  );

  return keyring.encodeAddress(
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
      const { publicKey, seed } = event.data;

      this.setState({
        address: keyring.encodeAddress(publicKey),
        isBipBusy: false,
        seed
      });
    };
    this.state = {
      ...this.emptyState(this.props.passthrough),
      seedOptions: [
        { value: 'bip', text: t('Mnemonic') },
        { value: 'raw', text: t('Raw seed') }
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
          text={t('Reset')}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          onClick={this.onShowWarning}
          text={t('Save')}
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
            autoFocus
            className='full'
            isError={!isNameValid}
            label={t('name the account')}
            onChange={this.onChangeName}
            value={name}
          />
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            isAction
            isDisabled={isBipBusy}
            isError={!isSeedValid}
            label={
              seedType === 'bip'
                ? t('create from the following mnemonic seed')
                : t('create from the following seed (hex or string)')
            }
            onChange={this.onChangeSeed}
            placeholder={
              isBipBusy
                ? t('Generating Mnemeonic seed')
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
          <Password
            className='full'
            isError={!isPassValid}
            label={t('encrypt it using the password')}
            onChange={this.onChangePass}
            value={password}
          />
        </div>
        <Modal
          className='app--accounts-Modal'
          dimmer='inverted'
          open={showWarning}
          size='small'
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
            text={t('Cancel')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.onCommit}
            text={t('Create and backup account')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderModalContent () {
    const { t } = this.props;
    const { address } = this.state;

    return [
      <Modal.Header key='header'>
        {t('sImportant notice!')}
      </Modal.Header>,
      <Modal.Content key='content'>
        {t('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always redownload this file later.')}
        <Modal.Description>
          {t('Please make sure to save this file in a secure location as it is the only way to restore your account.')}
        </Modal.Description>
        <AddressSummary
          className='accounts--Modal-Address'
          value={address}
        />
      </Modal.Content>
    ];
  }

  private generateSeed (seedType: SeedType, passthrough?: string | null): State {
    if (seedType === 'bip') {
      this.bipWorker.postMessage('create');

      return {
        isBipBusy: true,
        seed: ''
      } as State;
    }

    const seed = passthrough || u8aToHex(randomAsU8a());
    const address = addressFromSeed(seed, seedType);

    return {
      address,
      isBipBusy: false,
      seed
    } as State;
  }

  private emptyState (passthrough?: string | null): State {
    const seedType = passthrough
      ? 'raw'
      : this.state.seedType;

    return {
      ...this.generateSeed(seedType, passthrough),
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
          : rawValidate(seed);
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
    const { onCreateAccount, onStatusChange, t } = this.props;
    const { name, password, seed, seedType } = this.state;

    const status = {
      action: 'create'
    } as ActionStatus;

    try {
      const pair = seedType === 'bip'
        ? keyring.createAccountMnemonic(seed, password, { name })
        : keyring.createAccount(rawToSeed(seed), password, { name });

      const json = pair.toJson(password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${pair.address()}.json`);

      status.account = pair.address();
      status.status = pair ? 'success' : 'error';
      status.message = t('created account');

      InputAddress.setLastValue('account', pair.address());
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    this.onHideWarning();

    onCreateAccount();
    onStatusChange(status);
  }

  private onDiscard = (): void => {
    this.setState(this.emptyState());
  }

  private selectSeedType = (seedType: SeedType): void => {
    if (seedType === this.state.seedType) {
      return;
    }

    this.setState({
      ...this.generateSeed(seedType),
      seedType
    });
  }
}

export default translate(Creator);
