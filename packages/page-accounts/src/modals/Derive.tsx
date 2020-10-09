// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringPair } from '@polkadot/keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AddressRow, Button, Input, InputAddress, Modal, Password, StatusContext } from '@polkadot/react-components';
import { useApi, useDebounce, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { keyExtractPath } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import { downloadAccount } from './Create';
import CreateConfirmation from './CreateConfirmation';

interface Props {
  className?: string;
  from: string;
  onClose: () => void;
}

interface DeriveAddress {
  address: string | null;
  deriveError: string | null;
}

interface LockState {
  isLocked: boolean;
  lockedError: string | null;
}

function deriveValidate (suri: string, pairType: KeypairType): string | null {
  try {
    const { path } = keyExtractPath(suri);

    // we don't allow soft for ed25519
    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'Soft derivation paths are not allowed on ed25519';
    }
  } catch (error) {
    return (error as Error).message;
  }

  return null;
}

function createAccount (source: KeyringPair, suri: string, name: string, password: string, success: string, genesisHash?: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    const derived = source.derive(suri);

    derived.setMeta({ ...derived.meta, genesisHash, name, parentAddress: source.address, tags: [] });

    const result = keyring.addPair(derived, password || '');
    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;

    downloadAccount(result);
    InputAddress.setLastValue('account', address);
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function Derive ({ className = '', from, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const { queueAction } = useContext(StatusContext);
  const [source] = useState(keyring.getPair(from));
  const [isBusy, setIsBusy] = useState(false);
  const [{ address, deriveError }, setDerive] = useState<DeriveAddress>({ address: null, deriveError: null });
  const [isConfirmationOpen, toggleConfirmation] = useToggle();
  const [{ isLocked, lockedError }, setIsLocked] = useState<LockState>({ isLocked: source.isLocked, lockedError: null });
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isPassValid, password }, setPassword] = useState({ isPassValid: false, password: '' });
  const [{ isPass2Valid, password2 }, setPassword2] = useState({ isPass2Valid: false, password2: '' });
  const [{ isRootValid, rootPass }, setRootPass] = useState({ isRootValid: false, rootPass: '' });
  const [suri, setSuri] = useState('');
  const debouncedSuri = useDebounce(suri);
  const isValid = !!address && !deriveError && isNameValid && isPassValid && isPass2Valid;

  useEffect((): void => {
    setIsLocked({ isLocked: source.isLocked, lockedError: null });
  }, [source]);

  useEffect((): void => {
    !isLocked && setDerive((): DeriveAddress => {
      let address: string | null = null;
      const deriveError = deriveValidate(debouncedSuri, source.type);

      if (!deriveError) {
        const result = source.derive(debouncedSuri);

        address = result.address;
      }

      return { address, deriveError };
    });
  }, [debouncedSuri, isLocked, source]);

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onChangePass = useCallback(
    (password: string) => setPassword({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onChangePass2 = useCallback(
    (password2: string) => setPassword2({ isPass2Valid: keyring.isPassValid(password2) && (password2 === password), password2 }),
    [password]
  );

  const _onChangeRootPass = useCallback(
    (rootPass: string): void => {
      setRootPass({ isRootValid: !!rootPass, rootPass });
      setIsLocked(({ isLocked }) => ({ isLocked, lockedError: null }));
    },
    []
  );

  const _onUnlock = useCallback(
    (): void => {
      setIsBusy(true);
      setTimeout((): void => {
        try {
          source.decodePkcs8(rootPass);
          setIsLocked({ isLocked: source.isLocked, lockedError: null });
        } catch (error) {
          console.error(error);
          setIsLocked({ isLocked: true, lockedError: (error as Error).message });
        }

        setIsBusy(false);
      }, 0);
    },
    [rootPass, source]
  );

  const _onCommit = useCallback(
    (): void => {
      if (!isValid) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const status = createAccount(source, suri, name, password, t<string>('created account'), isDevelopment ? undefined : api.genesisHash.toString());

        queueAction(status);
        setIsBusy(false);
        onClose();
      }, 0);
    },
    [api, isDevelopment, isValid, name, onClose, password, queueAction, source, suri, t]
  );

  const sourceStatic = (
    <InputAddress
      help={t<string>('The selected account to perform the derivation on.')}
      isDisabled
      label={t<string>('derive root account')}
      value={from}
    />
  );

  return (
    <Modal
      className={className}
      header={t<string>('Derive account from pair')}
    >
      {address && isConfirmationOpen
        ? (
          <CreateConfirmation
            address={address}
            derivePath={suri}
            isBusy={isBusy}
            name={name}
            pairType={source.type}
          />
        )
        : (
          <Modal.Content>
            {isLocked && (
              <>
                {sourceStatic}
                <Password
                  autoFocus
                  help={t<string>('The password to unlock the selected account.')}
                  isError={!!lockedError}
                  label={t<string>('password')}
                  onChange={_onChangeRootPass}
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
                  help={t<string>('You can set a custom derivation path for this account using the following syntax "/<soft-key>//<hard-key>///<password>". The "/<soft-key>" and "//<hard-key>" may be repeated and mixed`. The "///password" is optional and should only occur once.')}
                  label={t<string>('derivation path')}
                  onChange={setSuri}
                  placeholder={t<string>('//hard/soft')}
                />
                <Input
                  className='full'
                  help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
                  isError={!isNameValid}
                  label={t<string>('name')}
                  onChange={_onChangeName}
                  onEnter={_onCommit}
                  placeholder={t<string>('new account')}
                  value={name}
                />
                <Password
                  className='full'
                  help={t<string>('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
                  isError={!isPassValid}
                  label={t<string>('password')}
                  onChange={_onChangePass}
                  onEnter={_onCommit}
                  value={password}
                />
                <Password
                  className='full'
                  help={t<string>('Verify the password entered above.')}
                  isError={!isPass2Valid}
                  label={t<string>('password (repeat)')}
                  onChange={_onChangePass2}
                  onEnter={_onCommit}
                  value={password2}
                />
              </AddressRow>
            )}
          </Modal.Content>
        )
      }
      <Modal.Actions onCancel={onClose}>
        {isLocked
          ? (
            <Button
              icon='lock'
              isBusy={isBusy}
              isDisabled={!isRootValid}
              label={t<string>('Unlock')}
              onClick={_onUnlock}
            />
          )
          : (isConfirmationOpen
            ? (
              <>
                <Button
                  icon='step-backward'
                  label={t<string>('Prev')}
                  onClick={toggleConfirmation}
                />
                <Button
                  icon='plus'
                  isBusy={isBusy}
                  label={t<string>('Save')}
                  onClick={_onCommit}
                />
              </>
            )
            : (
              <Button
                icon='step-forward'
                isDisabled={!isValid}
                label={t<string>('Next')}
                onClick={toggleConfirmation}
              />
            )
          )
        }
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Derive);
