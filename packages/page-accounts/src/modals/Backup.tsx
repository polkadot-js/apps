// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';
import { nextTick } from '@polkadot/util';

import { useTranslation } from '../translate.js';

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
      nextTick((): void => {
        try {
          const addressKeyring = address && keyring.getPair(address);
          const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
          const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

          // eslint-disable-next-line deprecation/deprecation
          FileSaver.saveAs(blob, `${address}.json`);
        } catch (error) {
          setBackupFailed(true);
          setIsBusy(false);
          console.error(error);

          return;
        }

        setIsBusy(false);
        onClose();
      });
    },
    [address, onClose, password]
  );

  return (
    <Modal
      className='app--accounts-Modal'
      header={t('Backup account')}
      onClose={onClose}
    >
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
              isError={isPassTouched && !isPassValid}
              label={t('password')}
              onChange={_onChangePass}
              onEnter={_doBackup}
              tabIndex={0}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='download'
          isBusy={isBusy}
          isDisabled={!isPassValid}
          label={t('Download')}
          onClick={_doBackup}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Backup);
