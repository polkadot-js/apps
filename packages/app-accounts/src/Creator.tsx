// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { ComponentProps } from './types';

import FileSaver from 'file-saver';
import React from 'react';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { withApi, withMulti } from '@polkadot/ui-api';
import { AddressSummary, AddressRow, Button, Dropdown, Input, InputTags, Labelled, Modal, Password, TxComponent } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractPath, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import translate from './translate';

type Props = ComponentProps & ApiProps & I18nProps & {
  match: {
    params: {
      seed?: string,
      type?: KeypairType
    }
  }
};

type SeedType = 'bip' | 'raw' | 'dev';

type SeedOption = {
  text: string,
  value: SeedType
};

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
  seedOptions: Array<SeedOption>,
  seedType: SeedType,
  showWarning: boolean,
  tags: Array<string>
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
  return ((seed.length > 0) && (seed.length <= 32)) || isHexSeed(seed);
}

function addressFromSeed (phrase: string, derivePath: string, pairType: KeypairType): string {
  return keyring
    .createFromUri(`${phrase.trim()}${derivePath}`, {}, pairType)
    .address();
}

class Creator extends TxComponent<Props, State> {
  state: State = { seedType: 'bip' } as State;

  constructor (props: Props) {
    super(props);

    const { isDevelopment, match: { params: { seed, type } }, t } = this.props;
    const seedOptions: Array<SeedOption> = [
      { value: 'bip', text: t('Mnemonic') },
      { value: 'raw', text: t('Raw seed') }
    ];

    if (isDevelopment) {
      seedOptions.push({ value: 'dev', text: t('Development') });
    }

    this.state = {
      ...this.emptyState(seed || null, '', type || DEFAULT_TYPE),
      seedOptions
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
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private renderInput () {
    const { t } = this.props;
    const { deriveError, derivePath, isNameValid, isPassValid, isSeedValid, name, pairType, password, seed, seedOptions, seedType, tags } = this.state;
    const seedLabel = (() => {
      switch (seedType) {
        case 'bip':
          return t('mnemonic seed');
        case 'dev':
          return t('development seed');
        default:
          return t('seed (hex or string)');
      }
    })();

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
            isError={!isNameValid}
            label={t('name')}
            onChange={this.onChangeName}
            onEnter={this.submit}
            value={name}
          />
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            help={t('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
            isAction
            isError={!isSeedValid}
            label={seedLabel}
            onChange={this.onChangeSeed}
            onEnter={this.submit}
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
            help={t('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
            isError={!isPassValid}
            label={t('password')}
            onChange={this.onChangePass}
            onEnter={this.submit}
            value={password}
          />
        </div>
        <div className='ui--row'>
          <InputTags
            help={t('Additional user-specified tags that can be used to identify the account. Tags can be used for categorization and filtering.')}
            label={t('user-defined tags')}
            onChange={this.onChangeTags}
            value={tags}
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
                help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
                label={t('keypair crypto type')}
                onChange={this.onChangePairType}
                options={uiSettings.availableCryptos}
              />
            </div>
            <div className='ui--row'>
              <Input
                className='full'
                help={t('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`.')}
                isError={!!deriveError}
                label={t('secret derivation path')}
                onChange={this.onChangeDerive}
                onEnter={this.submit}
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
        {this.renderModal()}
      </div>
    );
  }

  private renderModal () {
    const { t } = this.props;
    const { address, name, showWarning } = this.state;

    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open={showWarning}
      >
        <Modal.Header>
          {t('Important notice')}
        </Modal.Header>
        <Modal.Content>
          <AddressRow
            defaultName={name}
            isInline
            value={address}
          >
            <p>{t('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
            <p>{t('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
          </AddressRow>
        </Modal.Content>
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
      </Modal>
    );
  }

  private generateSeed (_seed: string | null, derivePath: string, seedType: SeedType, pairType: KeypairType): State {
    const seed = (() => {
      switch (seedType) {
        case 'bip':
          return mnemonicGenerate();
        case 'dev':
          return DEV_PHRASE;
        default:
          return _seed || u8aToHex(randomAsU8a());
      }
    })();
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
      name: 'new account',
      password: '',
      pairType,
      seedType,
      showWarning: false,
      tags: []
    };
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { derivePath = prevState.derivePath, name = prevState.name, pairType = prevState.pairType, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning, tags = prevState.tags } = newState;
        let address = prevState.address;
        const deriveError = deriveValidate(derivePath, pairType);
        const isNameValid = !!name;
        const isPassValid = keyring.isPassValid(password);
        let isSeedValid = seedType === 'raw'
          ? rawValidate(seed)
          : mnemonicValidate(seed);

        if (!deriveError && isSeedValid && (seed !== prevState.seed || derivePath !== prevState.derivePath || pairType !== prevState.pairType)) {
          try {
            address = addressFromSeed(seed, derivePath, pairType);
          } catch (error) {
            isSeedValid = false;
          }
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
          showWarning,
          tags
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

  private onChangePairType = (pairType: KeypairType): void => {
    this.nextState({ pairType } as State);
  }

  private onChangePass = (password: string): void => {
    this.nextState({ password } as State);
  }

  private onChangeSeed = (seed: string): void => {
    this.nextState({ seed } as State);
  }

  private onChangeTags = (tags: Array<string>): void => {
    this.setState({ tags });
  }

  private onShowWarning = (): void => {
    this.nextState({ showWarning: true } as State);
  }

  private onHideWarning = (): void => {
    this.nextState({ showWarning: false } as State);
  }

  private onCommit = (): void => {
    const { basePath, onStatusChange, t } = this.props;
    const { derivePath, name, pairType, password, seed, tags } = this.state;

    const status = {
      action: 'create'
    } as ActionStatus;

    try {
      const { json, pair } = keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
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

export default withMulti(
  Creator,
  translate,
  withApi
);
