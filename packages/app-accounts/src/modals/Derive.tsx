// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useContext, useEffect, useState } from 'react';
import { AddressRow, Button, Input, InputAddress, Modal, Password, StatusContext } from '@polkadot/react-components';
import { useDebounce } from '@polkadot/react-components/hooks';
import keyring from '@polkadot/ui-keyring';
import { keyExtractPath } from '@polkadot/util-crypto';

import translate from '../translate';
import { downloadAccount } from './Create';
import CreateConfirmation from './CreateConfirmation';

interface Props extends I18nProps {
  from: string;
  onClose: () => void;
}

interface DerivedAddress {
  address: string | null;
  deriveError: string | null;
}

function deriveValidate (suri: string, pairType: KeypairType): string | null {
  try {
    const { path } = keyExtractPath(suri);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'Soft derivation paths are not allowed on ed25519';
    }
  } catch (error) {
    return error.message;
  }

  return null;
}

function createAccount (source: KeyringPair, suri: string, name: string, password: string, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const derived = source.derive(suri);

    derived.setMeta({ ...derived.meta, name, tags: [] });

    const result = keyring.addPair(derived, password || '');
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

function Derive ({ className, from, onClose, t }: Props): React.ReactElement {
  const { queueAction } = useContext(StatusContext);
  const [source] = useState(keyring.getPair(from));
  const [{ address, deriveError }, setDerived] = useState<DerivedAddress>({ address: null, deriveError: null });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(source.isLocked);
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPassValid, password }, setPassword] = useState({ isPassValid: false, password: '' });
  const [rootPass, setRootPass] = useState('');
  const [suri, setSuri] = useState('');
  const debouncedSuri = useDebounce(suri);
  const isValid = !!address && !deriveError && isNameValid && isPassValid;

  useEffect((): void => {
    setIsLocked(source.isLocked);
  }, [source]);

  useEffect((): void => {
    setDerived((): DerivedAddress => {
      let address: string | null = null;
      const deriveError = deriveValidate(debouncedSuri, source.type);

      if (!deriveError) {
        const result = source.derive(suri);

        address = result.address;
      }

      return { address, deriveError };
    });
  }, [debouncedSuri]);

  const _onChangeName = (name: string): void => setName({ isNameValid: !!name.trim(), name });
  const _onChangePass = (password: string): void => setPassword({ isPassValid: keyring.isPassValid(password), password });
  const _toggleConfirmation = (): void => setIsConfirmationOpen(!isConfirmationOpen);
  const _onUnlock = (): void => {
    try {
      source.decodePkcs8(rootPass);
    } catch (error) {
      console.error(error);
    }

    setIsLocked(source.isLocked);
  };

  const _onCommit = (): void => {
    if (!isValid) {
      return;
    }

    const status = createAccount(source, suri, name, password, t('created account'));

    _toggleConfirmation();
    queueAction(status);
    onClose();
  };

  const sourceStatic = (
    <InputAddress
      help={t('The selected account to perform the derivation on.')}
      isDisabled
      label={t('derive root account')}
      value={from}
    />
  );

  return (
    <Modal
      className={className}
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Derive account from pair')}</Modal.Header>
      {address && isConfirmationOpen && (
        <CreateConfirmation
          address={address}
          name={name}
          onCommit={_onCommit}
          onClose={_toggleConfirmation}
        />
      )}
      <Modal.Content>
        {isLocked && (
          <>
            {sourceStatic}
            <Password
              autoFocus
              help={t('The password to unlock the selected account.')}
              label={t('password')}
              onChange={setRootPass}
              value={rootPass}
            />
          </>
        )}
        {!isLocked && (
          <AddressRow
            defaultName={name}
            noDefaultNameOpacity
            value={deriveError ? '' : address}
          >
            {sourceStatic}
            <Input
              autoFocus
              help={t('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>///<password>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. The "///password" is optional and should only occur once.')}
              label={t('derivation path')}
              onChange={setSuri}
              placeholder={t('//hard/soft')}
            />
            <Input
              className='full'
              help={t('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
              isError={!isNameValid}
              label={t('name')}
              onChange={_onChangeName}
              onEnter={_onCommit}
              placeholder={t('new account')}
              value={name}
            />
            <Password
              className='full'
              help={t('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
              isError={!isPassValid}
              label={t('password')}
              onChange={_onChangePass}
              onEnter={_onCommit}
              value={password}
            />
          </AddressRow>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          {isLocked
            ? (
              <Button
                icon='lock'
                isDisabled={!rootPass}
                isPrimary
                label={t('Unlock')}
                onClick={_onUnlock}
              />
            )
            : (
              <Button
                icon='plus'
                isDisabled={!isValid}
                isPrimary
                label={t('Save')}
                onClick={_toggleConfirmation}
              />
            )
          }
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(Derive);
