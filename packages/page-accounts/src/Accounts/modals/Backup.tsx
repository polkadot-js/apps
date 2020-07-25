// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface Props {
  onClose: () => void;
  address: string;
}

function Backup ({ address, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [{ isPassTouched, password }, setPassword] = useState({ isPassTouched: false, password: '' });
  const [backupFailed, setBackupFailed] = useState(false);
  const isPassValid = !backupFailed && keyring.isPassValid(password);

  const _onChangePass = useCallback(
    (password: string): void => {
      setBackupFailed(false);
      setPassword({ isPassTouched: true, password });
    },
    []
  );

  const _doBackup = useCallback(
    (): void => {
      setIsBusy(true);
      setTimeout((): void => {
        try {
          const addressKeyring = address && keyring.getPair(address);
          const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
          const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

          FileSaver.saveAs(blob, `${address}.json`);
        } catch (error) {
          setBackupFailed(true);
          setIsBusy(false);
          console.error(error);

          return;
        }

        setIsBusy(false);
        onClose();
      }, 0);
    },
    [address, onClose, password]
  );

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Backup account')}
    >
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t<string>('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
          <p>{t<string>('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
          <div>
            <Password
              autoFocus
              help={t<string>('The account password as specified when creating the account. This is used to encrypt the backup file and subsequently decrypt it when restoring the account.')}
              isError={isPassTouched && !isPassValid}
              label={t<string>('password')}
              onChange={_onChangePass}
              onEnter={_doBackup}
              tabIndex={0}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='download'
          isBusy={isBusy}
          isDisabled={!isPassValid}
          label={t<string>('Download')}
          onClick={_doBackup}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Backup);
