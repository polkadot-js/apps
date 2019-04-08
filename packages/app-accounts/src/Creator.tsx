// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { ComponentProps } from './types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressSummary, Button, Dropdown, Input, Labelled, Modal, Password } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractPath, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import translate from './translate';

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
  deriveError: string | null,
  derivePath: string,
  isNameValid: boolean,
  isSeedValid: boolean,
  isPassValid: boolean,
  isValid: boolean,
  name: string,
  pairType: KeypairType,
  password: string,
  seed: string,
  seedOptions: Array<{ value: SeedType, text: string }>,
  seedType: SeedType,
  showWarning: boolean
};

const DEFAULT_TYPE = 'sr25519';

function deriveValidate (derivePath: string, pairType: KeypairType): string | null {
  try {
    const { path } = keyExtractPath(derivePath);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519') {
      const firstSoft = path.find(({ isSoft }) => isSoft);

      if (firstSoft) {
        return 'Soft derivation paths are not allowed on ed25519';
      }
    }
  } catch (error) {
    return error.message;
  }

  return null;
}

function isHexSeed (seed: string): boolean {
  return isHex(seed) && seed.length === 66;
}

function rawValidate (seed: string): boolean {
  return seed.length <= 32 || isHexSeed(seed);
}

function addressFromSeed (phrase: string, derivePath: string, pairType: KeypairType): string {
  return keyring
    .createFromUri(`${phrase}${derivePath}`, {}, pairType)
    .address();
}

class Creator extends React.PureComponent<Props, State> {
  state: State = { seedType: 'bip' } as State;

  constructor (props: Props) {
    super(props);

    const { match: { params: { seed } }, t } = this.props;

    this.state = {
      ...this.emptyState(seed || null, '', DEFAULT_TYPE),
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
            withBonded
          />
          {this.renderInput()}
        </div>
        {this.renderButtons()}
      </div>
    );
  }

  private renderButtons () {
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

  private renderInput () {
    const { t } = this.props;
    const { deriveError, derivePath, isNameValid, isPassValid, isSeedValid, name, pairType, password, seed, seedOptions, seedType, showWarning } = this.state;

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
            isError={!isSeedValid}
            label={
              seedType === 'bip'
                ? t('create from the following mnemonic seed')
                : t('create from the following seed (hex or string)')
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
          <Password
            className='full'
            isError={!isPassValid}
            label={t('your password for this account')}
            onChange={this.onChangePass}
            value={password}
          />
        </div>
        <details
          className='accounts--Creator-advanced'
          open
        >
          <summary>{t('Advanced creation options')}</summary>
          <div className='ui--Params'>
            <div className='ui--row'>
              <Dropdown
                defaultValue={pairType}
                label={t('keypair crypto type')}
                onChange={this.onChangePairType}
                options={uiSettings.availableCryptos}
              />
            </div>
            <div className='ui--row'>
              <Input
                className='full'
                isError={!!deriveError}
                label={t('secret derivation path')}
                onChange={this.onChangeDerive}
                value={derivePath}
              />
            </div>
            {
              deriveError
                ? <Labelled label=''><article className='error'>{deriveError}</article></Labelled>
                : null
            }
          </div>
        </details>
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

  private renderModalButtons () {
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

  private renderModalContent () {
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

  private generateSeed (_seed: string | null, derivePath: string, seedType: SeedType, pairType: KeypairType): State {
    const seed = seedType === 'bip'
      ? mnemonicGenerate()
      : _seed || u8aToHex(randomAsU8a());
    const address = addressFromSeed(seed, derivePath, pairType);

    return {
      address,
      deriveError: null,
      derivePath,
      seed
    } as State;
  }

  private emptyState (seed: string | null, derivePath: string, pairType: KeypairType): State {
    const seedType = seed
      ? 'raw'
      : this.state.seedType;

    return {
      ...this.generateSeed(seed, derivePath, seedType, pairType),
      isNameValid: true,
      isPassValid: false,
      isSeedValid: true,
      isValid: false,
      name: 'new keypair',
      password: '',
      pairType,
      seedType,
      showWarning: false
    };
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { derivePath = prevState.derivePath, name = prevState.name, pairType = prevState.pairType, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning } = newState;
        let address = prevState.address;
        const deriveError = deriveValidate(derivePath, pairType);
        const isNameValid = !!name;
        const isSeedValid = seedType === 'bip'
          ? mnemonicValidate(seed)
          : rawValidate(seed);
        const isPassValid = keyring.isPassValid(password);

        if (!deriveError && isSeedValid && (seed !== prevState.seed || derivePath !== prevState.derivePath || pairType !== prevState.pairType)) {
          address = addressFromSeed(seed, derivePath, pairType);
        }

        return {
          address,
          deriveError,
          derivePath,
          isNameValid,
          isPassValid,
          isSeedValid,
          isValid: isNameValid && isPassValid && isSeedValid,
          name,
          pairType,
          password,
          seed,
          seedOptions,
          seedType,
          showWarning
        };
      }
    );
  }

  private onChangeDerive = (derivePath: string): void => {
    this.nextState({ derivePath } as State);
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
    const { derivePath, name, pairType, password, seed } = this.state;

    const status = {
      action: 'create'
    } as ActionStatus;

    try {
      const { json, pair } = keyring.addUri(`${seed}${derivePath}`, password, { name }, pairType);
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
    this.setState(({ pairType }) =>
      this.emptyState(null, '', pairType)
    );
  }

  private selectSeedType = (seedType: SeedType): void => {
    if (seedType === this.state.seedType) {
      return;
    }

    this.setState(({ derivePath, pairType }: State) => ({
      ...this.generateSeed(null, derivePath, seedType, pairType),
      seedType
    }));
  }
}

export default translate(Creator);
