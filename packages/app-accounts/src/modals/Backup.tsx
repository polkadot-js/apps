// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import FileSaver from 'file-saver';
import React, { useState, useMemo } from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface Props extends BareProps {
  onClose: () => void;
  address: string;
}

interface ButtonsProps {
  doBackup: () => void;
  isPassValid: boolean;
  onClose: () => void;
}

interface ContentProps {
  address: string;
  doBackup: () => void;
  isPassTouched: boolean;
  isPassValid: boolean;
  onChangePass: (password: string) => void;
  password: string;
}

export default function ({ address, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [isPassTouched, setIsPassTouched] = useState(false);
  const [backupFailed, setBackupFailed] = useState(false);
  const isPassValid = useMemo(() =>
    keyring.isPassValid(password) && !backupFailed,
  [password, backupFailed]);

  const _onChangePass = (value: string): void => {
    if (!isPassTouched) {
      setIsPassTouched(true);
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
      header={t('Backup account')}
      open
    >
      <Content
        address={address}
        doBackup={_doBackup}
        isPassTouched={isPassTouched}
        isPassValid={isPassValid}
        password={password}
        onChangePass={_onChangePass}
      />
      <Buttons
        doBackup={_doBackup}
        isPassValid={isPassValid}
        onClose={onClose}
      />
    </Modal>
  );
}

function Content ({ address, doBackup, isPassTouched, isPassValid, onChangePass, password }: ContentProps): React.ReactElement<ContentProps> {
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
            isError={isPassTouched && !isPassValid}
            label={t('password')}
            onChange={onChangePass}
            onEnter={doBackup}
            tabIndex={0}
            value={password}
          />
        </div>
      </AddressRow>
    </Modal.Content>
  );
}

function Buttons ({ doBackup, isPassValid, onClose }: ButtonsProps): React.ReactElement<ButtonsProps> {
  const { t } = useTranslation();

  return (
    <Modal.Actions>
      <Button.Group>
        <Button
          icon='cancel'
          isNegative
          label={t('Cancel')}
          onClick={onClose}
        />
        <Button.Or />
        <Button
          icon='download'
          isDisabled={!isPassValid}
          label={t('Download')}
          onClick={doBackup}
        />
      </Button.Group>
    </Modal.Actions>
  );
}
