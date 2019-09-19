// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { ModalProps } from '../types';

import FileSaver from 'file-saver';
import React from 'react';
import styled from 'styled-components';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { withApi, withMulti } from '@polkadot/react-api';
import { AddressRow, Button, Dropdown, Input, Labelled, Modal, Password } from '@polkadot/react-components';
import { InputAddress } from '@polkadot/react-components/InputAddress';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import translate from '../translate';
import CreateConfirmation from './CreateConfirmation';

interface Props extends ModalProps, ApiProps, I18nProps {
  seed?: string;
  type?: KeypairType;
}

type SeedType = 'bip' | 'raw' | 'dev';

interface SeedOption {
  text: string;
  value: SeedType;
}

interface AddressState {
  address: string;
  deriveError: string | null;
  derivePath: string;
  isSeedValid: boolean;
  pairType: KeypairType;
  seed: string;
  seedType: SeedType;
}

interface State extends AddressState {
  isNameValid: boolean;
  isPassValid: boolean;
  isValid: boolean;
  name: string;
  password: string;
  seedOptions: SeedOption[];
  showWarning: boolean;
  tags: string[];
}

const DEFAULT_TYPE = 'sr25519';

function deriveValidate (seed: string, derivePath: string, pairType: KeypairType): string | null {
  try {
    const { path } = keyExtractSuri(`${seed}${derivePath}`);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519') {
      const firstSoft = path.find(({ isSoft }): boolean => isSoft);

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
    .address;
}

function generateSeed (_seed: string | null, derivePath: string, seedType: SeedType, pairType: KeypairType): AddressState {
  const seed = ((): string => {
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
    isSeedValid: true,
    pairType,
    seedType,
    seed
  };
}

class Create extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { isDevelopment, seed, t, type } = this.props;
    const seedOptions: SeedOption[] = [
      { value: 'bip', text: t('Mnemonic') },
      { value: 'raw', text: t('Raw seed') }
    ];

    if (isDevelopment) {
      seedOptions.push({ value: 'dev', text: t('Development') });
    }

    const pairType = type || DEFAULT_TYPE;
    const seedType = seed ? 'raw' : 'bip';

    this.state = {
      ...generateSeed(seed || null, '', seedType, pairType),
      isNameValid: true,
      isPassValid: false,
      isValid: false,
      name: 'new account',
      password: '',
      seedOptions,
      showWarning: false,
      tags: []
    };
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { address, isValid, showWarning } = this.state;

    return (
      <Modal
        className={className}
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Add an account via seed')}</Modal.Header>
        {showWarning && (
          <CreateConfirmation
            address={address}
            name={name}
            onCommit={this.onCommit}
            onHideWarning={this.onHideWarning}
          />
        )}
        {this.renderInput()}
        <Modal.Actions>
          <Button.Group>
            <Button
              label={t('Cancel')}
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
        </Modal.Actions>
      </Modal>
    );
  }

  private renderInput (): React.ReactNode {
    const { t } = this.props;
    const { address, deriveError, derivePath, isNameValid, isPassValid, isSeedValid, name, pairType, password, seed, seedOptions, seedType } = this.state;
    const isDevSeed = seedType === 'dev';
    const seedLabel = ((): string => {
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
      <Modal.Content>
        <AddressRow
          defaultName={name}
          value={isSeedValid ? address : ''}
        >
          <Input
            autoFocus
            className='full'
            help={t('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
            isError={!isNameValid}
            label={t('name')}
            onChange={this.onChangeName}
            onEnter={this.onCommit}
            value={name}
          />
          <Input
            className='full'
            help={t('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
            isAction
            isError={!isSeedValid}
            isReadOnly={isDevSeed}
            label={seedLabel}
            onChange={this.onChangeSeed}
            onEnter={this.onCommit}
            value={seed}
          >
            <Dropdown
              isButton
              defaultValue={seedType}
              onChange={this.selectSeedType}
              options={seedOptions}
            />
          </Input>
          <Password
            className='full'
            help={t('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
            isError={!isPassValid}
            label={t('password')}
            onChange={this.onChangePass}
            onEnter={this.onCommit}
            value={password}
          />
          <details
            className='accounts--Creator-advanced'
            open
          >
            <summary>{t('Advanced creation options')}</summary>
            <Dropdown
              defaultValue={pairType}
              help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
              label={t('keypair crypto type')}
              onChange={this.onChangePairType}
              options={uiSettings.availableCryptos}
            />
            <Input
              className='full'
              help={t('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`.')}
              isError={!!deriveError}
              label={t('secret derivation path')}
              onChange={this.onChangeDerive}
              onEnter={this.onCommit}
              value={derivePath}
            />
            {deriveError && (
              <Labelled label=''><article className='error'>{deriveError}</article></Labelled>
            )}
          </details>
        </AddressRow>
      </Modal.Content>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { derivePath = prevState.derivePath, name = prevState.name, pairType = prevState.pairType, password = prevState.password, seed = prevState.seed, seedOptions = prevState.seedOptions, seedType = prevState.seedType, showWarning = prevState.showWarning, tags = prevState.tags } = newState;
        let address = prevState.address;
        const deriveError = deriveValidate(seed, derivePath, pairType);
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
    this.nextState({ derivePath });
  }

  private onChangeName = (name: string): void => {
    this.nextState({ name: name.trim() });
  }

  private onChangePairType = (pairType: KeypairType): void => {
    this.nextState({ pairType });
  }

  private onChangePass = (password: string): void => {
    this.nextState({ password });
  }

  private onChangeSeed = (seed: string): void => {
    this.nextState({ seed });
  }

  private onShowWarning = (): void => {
    this.nextState({ showWarning: true });
  }

  private onHideWarning = (): void => {
    this.nextState({ showWarning: false });
  }

  private onCommit = (): void => {
    const { onClose, onStatusChange, t } = this.props;
    const { derivePath, isValid, name, pairType, password, seed, tags } = this.state;
    const status: Partial<ActionStatus> = { action: 'create' };

    if (!isValid) {
      return;
    }

    try {
      const { json, pair } = keyring.addUri(`${seed}${derivePath}`, password, { name, tags }, pairType);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });
      const { address } = pair;

      FileSaver.saveAs(blob, `${address}.json`);

      status.account = address;
      status.status = pair ? 'success' : 'error';
      status.message = t('created account');

      InputAddress.setLastValue('account', address);
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    this.onHideWarning();

    onStatusChange(status as ActionStatus);
    onClose();
  }

  private onDiscard = (): void => {
    const { onClose } = this.props;

    onClose();
  }

  private selectSeedType = (seedType: SeedType): void => {
    if (seedType === this.state.seedType) {
      return;
    }

    this.setState(({ derivePath, pairType }: State): State => ({
      ...(generateSeed(null, derivePath, seedType, pairType) as State),
      seedType
    }));
  }
}

export default withMulti(
  styled(Create)`
    .accounts--Creator-advanced {
      margin-top: 1rem;
    }
  `,
  translate,
  withApi
);
