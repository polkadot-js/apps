// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { CreateResult } from '@polkadot/ui-keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { ModalProps } from '../../types';

import FileSaver from 'file-saver';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { DEV_PHRASE } from '@polkadot/keyring/defaults';
import { AddressRow, Button, Dropdown, Expander, Input, InputAddress, Modal, Password } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';

import { useTranslation } from '../../translate';
import CreateConfirmation from './CreateConfirmation';

interface Props extends ModalProps {
  className?: string;
  seed?: string;
  type?: KeypairType;
}

type SeedType = 'bip' | 'raw' | 'dev';

interface AddressState {
  address: string | null;
  deriveError: string | null;
  derivePath: string;
  isSeedValid: boolean;
  pairType: KeypairType;
  seed: string;
  seedType: SeedType;
}

interface CreateOptions {
  genesisHash?: string;
  name: string;
  tags?: string[];
}

const DEFAULT_PAIR_TYPE = 'sr25519';

function deriveValidate (seed: string, derivePath: string, pairType: KeypairType): string | null {
  try {
    const { path } = keyExtractSuri(`${seed}${derivePath}`);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'Soft derivation paths are not allowed on ed25519';
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

function newSeed (seed: string | undefined | null, seedType: SeedType): string {
  switch (seedType) {
    case 'bip':
      return mnemonicGenerate();
    case 'dev':
      return DEV_PHRASE;
    default:
      return seed || u8aToHex(randomAsU8a());
  }
}

function generateSeed (_seed: string | undefined | null, derivePath: string, seedType: SeedType, pairType: KeypairType = DEFAULT_PAIR_TYPE): AddressState {
  const seed = newSeed(_seed, seedType);
  const address = addressFromSeed(seed, derivePath, pairType);

  return {
    address,
    deriveError: null,
    derivePath,
    isSeedValid: true,
    pairType,
    seed,
    seedType
  };
}

function updateAddress (seed: string, derivePath: string, seedType: SeedType, pairType: KeypairType): AddressState {
  const deriveError = deriveValidate(seed, derivePath, pairType);
  let isSeedValid = seedType === 'raw'
    ? rawValidate(seed)
    : mnemonicValidate(seed);
  let address: string | null = null;

  if (!deriveError && isSeedValid) {
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
    isSeedValid,
    pairType,
    seed,
    seedType
  };
}

export function downloadAccount ({ json, pair }: CreateResult): void {
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

  FileSaver.saveAs(blob, `${pair.address}.json`);
  InputAddress.setLastValue('account', pair.address);
}

function createAccount (suri: string, pairType: KeypairType, { genesisHash, name, tags = [] }: CreateOptions, password: string, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const result = keyring.addUri(suri, password, { genesisHash, name, tags }, pairType);
    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;

    downloadAccount(result);
  } catch (error) {
    status.status = 'error';
    status.message = error.message;
  }

  return status;
}

function Create ({ className, onClose, onStatusChange, seed: propsSeed, type: propsType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const [{ address, deriveError, derivePath, isSeedValid, pairType, seed, seedType }, setAddress] = useState<AddressState>(generateSeed(propsSeed, '', propsSeed ? 'raw' : 'bip', propsType));
  const [isConfirmationOpen, toggleConfirmation] = useToggle();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPassValid, password }, setPassword] = useState({ isPassValid: false, password: '' });
  const [{ isPass2Valid, password2 }, setPassword2] = useState({ isPass2Valid: false, password2: '' });
  const isValid = !!address && !deriveError && isNameValid && isPassValid && isPass2Valid && isSeedValid;
  const seedOpt = useMemo(() => (
    isDevelopment
      ? [{ text: t('Development'), value: 'dev' }]
      : []
  ).concat(
    { text: t('Mnemonic'), value: 'bip' },
    { text: t('Raw seed'), value: 'raw' }
  ), [isDevelopment, t]);

  const _onChangePass = useCallback(
    (password: string) => setPassword({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onChangePass2 = useCallback(
    (password2: string) => setPassword2({ isPass2Valid: keyring.isPassValid(password2) && (password2 === password), password2 }),
    [password]
  );

  const _onChangeDerive = useCallback(
    (newDerivePath: string) => setAddress(updateAddress(seed, newDerivePath, seedType, pairType)),
    [pairType, seed, seedType]
  );

  const _onChangeSeed = useCallback(
    (newSeed: string) => setAddress(updateAddress(newSeed, derivePath, seedType, pairType)),
    [derivePath, pairType, seedType]
  );

  const _onChangePairType = useCallback(
    (newPairType: KeypairType) => setAddress(updateAddress(seed, derivePath, seedType, newPairType)),
    [derivePath, seed, seedType]
  );

  const _selectSeedType = useCallback(
    (newSeedType: SeedType): void => {
      if (newSeedType !== seedType) {
        setAddress(generateSeed(null, derivePath, newSeedType, pairType));
      }
    },
    [derivePath, pairType, seedType]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
      const status = createAccount(`${seed}${derivePath}`, pairType, options, password, t('created account'));

      toggleConfirmation();
      onStatusChange(status);
      onClose();
    },
    [api, derivePath, isDevelopment, isValid, name, onClose, onStatusChange, pairType, password, seed, t, toggleConfirmation]
  );

  return (
    <Modal
      className={className}
      header={t('Add an account via seed')}
    >
      {address && isConfirmationOpen && (
        <CreateConfirmation
          address={address}
          name={name}
          onClose={toggleConfirmation}
          onCommit={_onCommit}
        />
      )}
      <Modal.Content>
        <AddressRow
          defaultName={name}
          noDefaultNameOpacity
          value={isSeedValid ? address : ''}
        >
          <Input
            autoFocus
            className='full'
            help={t('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            onEnter={_onCommit}
            placeholder={t('new account')}
            value={name}
          />
          <Input
            className='full'
            help={t('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
            isAction
            isError={!isSeedValid}
            isReadOnly={seedType === 'dev'}
            label={
              seedType === 'bip'
                ? t('mnemonic seed')
                : seedType === 'dev'
                  ? t('development seed')
                  : t('seed (hex or string)')
            }
            onChange={_onChangeSeed}
            onEnter={_onCommit}
            value={seed}
          >
            <Dropdown
              defaultValue={seedType}
              isButton
              onChange={_selectSeedType}
              options={seedOpt}
            />
          </Input>
          <Password
            className='full'
            help={t('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
            isError={!isPassValid}
            label={t('password')}
            onChange={_onChangePass}
            onEnter={_onCommit}
            value={password}
          />
          <Password
            className='full'
            help={t('Verify the password entered above.')}
            isError={!isPass2Valid}
            label={t('password (repeat)')}
            onChange={_onChangePass2}
            onEnter={_onCommit}
            value={password2}
          />
          <Expander
            className='accounts--Creator-advanced'
            isOpen
            summary={t('Advanced creation options')}
          >
            <Dropdown
              defaultValue={pairType}
              help={t('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
              label={t('keypair crypto type')}
              onChange={_onChangePairType}
              options={uiSettings.availableCryptos}
            />
            <Input
              className='full'
              help={t('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>///<password>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. The "///password" is optional and should only occur once.')}
              isError={!!deriveError}
              label={t('secret derivation path')}
              onChange={_onChangeDerive}
              onEnter={_onCommit}
              placeholder={t('//hard/soft///password')}
              value={derivePath}
            />
            {deriveError && (
              <article className='error'>{deriveError}</article>
            )}
          </Expander>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isDisabled={!isValid}
          isPrimary
          label={t('Save')}
          onClick={toggleConfirmation}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Create)`
  .accounts--Creator-advanced {
    margin-top: 1rem;
  }
`);
