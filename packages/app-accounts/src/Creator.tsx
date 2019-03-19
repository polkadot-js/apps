// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { ComponentProps } from './types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressSummary, Button, Dropdown, Input, Modal, Password } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import { mnemonicToSeed, mnemonicValidate, naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

const BipWorker = require('worker-loader?name=[name].[hash:8].js!./bipWorker');

type Props = ComponentProps & I18nProps & {
  match: {
    params: {
      seed?: string
    }
  }
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
  pairType: KeypairType,
  pairTypeOptions: Array<{ value: KeypairType, text: string }>,
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

function addressFromSeed (seed: string, seedType: SeedType): string {
  const keypair = naclKeypairFromSeed(
    seedType === 'bip'
      ? mnemonicToSeed(seed)
      : (
        isHexSeed(seed)
          ? hexToU8a(seed)
          : stringToU8a(seed.padEnd(32))
      )
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

    const { match: { params: { seed } }, t } = this.props;

    this.bipWorker = new BipWorker();
    this.bipWorker.onmessage = (event: MessageEvent) => {
      const { publicKey, seed } = event.data;

      this.nextState({
        address: keyring.encodeAddress(publicKey),
        isBipBusy: false,
        seed
      } as State);
    };
    this.state = {
      ...this.emptyState(seed),
      pairTypeOptions: [
        { value: 'ed25519', text: t('Edwards (ed25519)') },
        { value: 'sr25519', text: t('Schnorrkel (sr25519)') }
      ],
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
          label={t('Reset')}
          onClick={this.onDiscard}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          label={t('Save')}
          onClick={this.onShowWarning}
        />
      </Button.Group>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { isBipBusy, isNameValid, isPassValid, isSeedValid, name, pairType, pairTypeOptions, password, seed, seedOptions, seedType, showWarning } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            isError={!isNameValid}
            label={t('name your account')}
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
                : undefined
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
          <Dropdown
            defaultValue={pairType}
            label={t('keypair crypto type')}
            onChange={this.onChangePairType}
            options={pairTypeOptions}
          />
        </div>
        <div className='ui--row'>
          <Password
            className='full'
            isError={!isPassValid}
            label={t('your password for this account')}
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
            label={t('Cancel')}
            onClick={this.onHideWarning}
          />
          <Button.Or />
          <Button
            isPrimary
            label={t('Create and backup account')}
            onClick={this.onCommit}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderModalContent () {
    const { t } = this.props;
    const { address } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Important notice!')}
        </Modal.Header>
        <Modal.Content>
          {t('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always redownload this file later.')}
          <Modal.Description>
            {t('Please make sure to save this file in a secure location as it is the only way to restore your account.')}
          </Modal.Description>
          <AddressSummary
            className='accounts--Modal-Address'
            value={address}
          />
        </Modal.Content>
      </>
    );
  }

  private generateSeed (seedType: SeedType, _seed?: string | null): State {
    if (seedType === 'bip') {
      this.bipWorker.postMessage('create');

      return {
        isBipBusy: true,
        seed: ''
      } as State;
    }

    const seed = _seed || u8aToHex(randomAsU8a());
    const address = addressFromSeed(seed, seedType);

    return {
      address,
      isBipBusy: false,
      seed
    } as State;
  }

  private emptyState (seed?: string | null): State {
    const seedType = seed
      ? 'raw'
      : this.state.seedType;

    return {
      ...this.generateSeed(seedType, seed),
      isNameValid: true,
      isPassValid: false,
      isSeedValid: true,
      isValid: false,
      name: 'new keypair',
      password: '',
      pairType: 'ed25519',
      seedType,
      showWarning: false
    };
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { isBipBusy = prevState.isBipBusy, name = prevState.name, pairType = prevState.pairType, pairTypeOptions = prevState.pairTypeOptions, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning } = newState;
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
          pairType,
          pairTypeOptions,
          password,
          seed,
          seedOptions,
          seedType,
          showWarning
        };
      }
    );
  }

  private onChangeName = (name: string): void => {
    this.nextState({ name } as State);
  }

  private onChangePass = (password: string): void => {
    this.nextState({ password } as State);
  }

  private onChangeSeed = (seed: string): void => {
    this.nextState({ seed } as State);
  }

  private onChangePairType = (pairType: KeypairType): void => {
    this.nextState({ pairType } as State);
  }

  private onShowWarning = (): void => {
    this.nextState({ showWarning: true } as State);
  }

  private onHideWarning = (): void => {
    this.nextState({ showWarning: false } as State);
  }

  private onCommit = (): void => {
    const { basePath, onStatusChange, t } = this.props;
    const { name, pairType, password, seed } = this.state;

    const status = {
      action: 'create'
    } as ActionStatus;

    try {
      const { json, pair } = keyring.createUri(seed, password, { name }, pairType);
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

    onStatusChange(status);

    window.location.hash = basePath;
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
