// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, FormProps$Refs, FormProps$Hooks } from '@polkadot/react-components/types';

import FileSaver from 'file-saver';
import React, { useState, useMemo } from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import { useForm, usePassword } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface Props extends BareProps {
  onClose: () => void;
  address: string;
}

interface ButtonsProps extends FormProps$Refs {
  doBackup: () => void;
  isPasswordValid: boolean;
  onClose: () => void;
}

interface ContentProps extends FormProps$Hooks {
  address: string;
  isPasswordTouched: boolean;
  isPasswordValid: boolean;
  onChangePassword: (password: string) => void;
  password: string;
}

export default function ({ address, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { password, setPassword, ...passwordState } = usePassword();
  const { cancelButtonRef, submitButtonRef, onInputEnterKey, onInputEscapeKey } = useForm();

  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [backupFailed, setBackupFailed] = useState(false);
  const isPasswordValid = useMemo(
    () => passwordState.isPasswordValid && !backupFailed,
    [passwordState.isPasswordValid, backupFailed]
  );

  function _onChangePassword (value: string): void {
    if (!isPasswordTouched) {
      setIsPasswordTouched(true);
    }

    setBackupFailed(false);
    setPassword(value);
  };
  const _doBackup = (): void => {
    try {
      const addressKeyring = address && keyring.getPair(address);
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);
    } catch (error) {
      setBackupFailed(true);
      console.error(error);
      return;
    }

    onClose();
  };

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Backup account')}</Modal.Header>
      <Content
        address={address}
        isPasswordTouched={isPasswordTouched}
        isPasswordValid={isPasswordValid}
        password={password}
        onChangePassword={_onChangePassword}
        onInputEnterKey={onInputEnterKey}
        onInputEscapeKey={onInputEscapeKey}
      />
      <Buttons
        doBackup={_doBackup}
        isPasswordValid={isPasswordValid}
        onClose={onClose}
        cancelButtonRef={cancelButtonRef}
        submitButtonRef={submitButtonRef}
      />
    </Modal>
  );
}

function Content ({
  address,
  isPasswordTouched,
  isPasswordValid,
  password,
  onChangePassword,
  onInputEnterKey,
  onInputEscapeKey
}: ContentProps): React.ReactElement<ContentProps> {
  const { t } = useTranslation();

  return (
    <Modal.Content>
      <AddressRow
        isInline
        value={address}
      >
        <p>{t('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
        <p>{t('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
        <div>
          <Password
            autoFocus
            help={t('The account password as specified when creating the account. This is used to encrypt the backup file and subsequently decrypt it when restoring the account.')}
            isError={isPasswordTouched && !isPasswordValid}
            label={t('password')}
            onChange={onChangePassword}
            onEnter={onInputEnterKey}
            onEscape={onInputEscapeKey}
            tabIndex={0}
            value={password}
          />
        </div>
      </AddressRow>
    </Modal.Content>
  );
}

interface ButtonsProps extends FormProps$Refs {
  doBackup: () => void;
  isPasswordValid: boolean;
  onClose: () => void;
}

function Buttons ({
  doBackup,
  isPasswordValid,
  onClose,
  submitButtonRef,
  cancelButtonRef
}: ButtonsProps): React.ReactElement<ButtonsProps> {
  const { t } = useTranslation();

  return (
    <Modal.Actions>
      <Button.Group>
        <Button
          icon='cancel'
          isNegative
          label={t('Cancel')}
          onClick={onClose}
          ref={cancelButtonRef}
        />
        <Button.Or />
        <Button
          icon='download'
          isDisabled={!isPasswordValid}
          label={t('Download')}
          onClick={doBackup}
          ref={submitButtonRef}
        />
      </Button.Group>
    </Modal.Actions>
  );
}
