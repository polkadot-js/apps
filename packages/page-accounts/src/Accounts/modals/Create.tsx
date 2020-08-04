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
import { AddressRow, Button, Dropdown, Expander, Input, InputAddress, Modal } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex, u8aToHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicGenerate, mnemonicValidate, randomAsU8a } from '@polkadot/util-crypto';
import { getEnvironment } from '@polkadot/react-api/util';

import { useTranslation } from '../../translate';
import PasswordInput from '../PasswordInput';
import CreateConfirmation from './CreateConfirmation';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
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
    return (error as Error).message;
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

    InputAddress.setLastValue('account', address);

    if (getEnvironment() === 'web') {
      downloadAccount(result);
    }
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function Create ({ className = '', onClose, onStatusChange, seed: propsSeed, type: propsType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const [{ address, deriveError, derivePath, isSeedValid, pairType, seed, seedType }, setAddress] = useState<AddressState>(generateSeed(propsSeed, '', propsSeed ? 'raw' : 'bip', propsType));
  const [isConfirmationOpen, toggleConfirmation] = useToggle();
  const [isBusy, setIsBusy] = useState(false);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPasswordValid, password }, setPassword] = useState({ isPasswordValid: false, password: '' });
  const isValid = !!address && !deriveError && isNameValid && isPasswordValid && isSeedValid;
  const seedOpt = useMemo(() => (
    isDevelopment
      ? [{ text: t<string>('Development'), value: 'dev' }]
      : []
  ).concat(
    { text: t<string>('Mnemonic'), value: 'bip' },
    { text: t<string>('Raw seed'), value: 'raw' }
  ), [isDevelopment, t]);

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

  const _onPasswordChange = useCallback(
    (password: string, isPasswordValid: boolean) => setPassword({ isPasswordValid, password }),
    []
  );

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
        const status = createAccount(`${seed}${derivePath}`, pairType, options, password, t<string>('created account'));

        toggleConfirmation();
        onStatusChange(status);
        setIsBusy(false);
        onClose();
      }, 0);
    },
    [api, derivePath, isDevelopment, isValid, name, onClose, onStatusChange, pairType, password, seed, t, toggleConfirmation]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add an account via seed')}
      size='large'
    >
      {address && isConfirmationOpen && (
        <CreateConfirmation
          address={address}
          isBusy={isBusy}
          name={name}
          onClose={toggleConfirmation}
          onCommit={_onCommit}
        />
      )}
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <AddressRow
              defaultName={name}
              noDefaultNameOpacity
              value={isSeedValid ? address : ''}
            />
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              className='full'
              help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
              isError={!isNameValid}
              label={t<string>('name')}
              onChange={_onChangeName}
              onEnter={_onCommit}
              placeholder={t<string>('new account')}
              value={name}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The name for this account and how it will appear under your addresses. With an on-chain identity, it can be made available to others.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              className='full'
              help={t<string>('The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your node.')}
              isAction
              isError={!isSeedValid}
              isReadOnly={seedType === 'dev'}
              label={
                seedType === 'bip'
                  ? t<string>('mnemonic seed')
                  : seedType === 'dev'
                    ? t<string>('development seed')
                    : t<string>('seed (hex or string)')
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
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The secret seed value for this account. Ensure that you keep this in a safe place, with access to the seed you can re-create the account.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <PasswordInput
          onChange={_onPasswordChange}
          onEnter={_onCommit}
          password={password}/>
        <Expander
          className='accounts--Creator-advanced'
          isOpen
          summary={t<string>('Advanced creation options')}
        >
          <Modal.Columns>
            <Modal.Column>
              <Dropdown
                defaultValue={pairType}
                help={t<string>('Determines what cryptography will be used to create this account. Note that to validate on Polkadot, the session account must use "ed25519".')}
                label={t<string>('keypair crypto type')}
                onChange={_onChangePairType}
                options={uiSettings.availableCryptos}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('If you are moving accounts between applications, ensure that you use the correct type.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <Input
                className='full'
                help={t<string>('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>///<password>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. The "///password" is optional and should only occur once.')}
                isError={!!deriveError}
                label={t<string>('secret derivation path')}
                onChange={_onChangeDerive}
                onEnter={_onCommit}
                placeholder={
                  pairType === 'sr25519'
                    ? t<string>('//hard/soft///password')
                    : t<string>('//hard///password')
                }
                value={derivePath}
              />
              {deriveError && (
                <article className='error'>{deriveError}</article>
              )}
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The derivation path allows you to create different accounts from the same base mnemonic.')}</p>
            </Modal.Column>
          </Modal.Columns>
        </Expander>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isBusy={isBusy}
          isDisabled={!isValid}
          label={t<string>('Save')}
          onClick={toggleConfirmation}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Create)`
  .accounts--Creator-advanced {
    margin-top: 1rem;
    overflow: visible;
  }
`);
