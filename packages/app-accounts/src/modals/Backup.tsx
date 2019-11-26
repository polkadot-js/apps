// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import FileSaver from 'file-saver';
import React from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { useForm, usePassword } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends I18nProps {
  onClose: () => void;
  address: string;
}

function Backup (props: Props): React.ReactElement<Props> {
  const { address, onClose, t } = props;

  const { cancelButtonRef, submitButtonRef, onInputEnterKey, onInputEscapeKey } = useForm();
  const [
    [password, setPassword],
    [isPasswordValid, setIsPasswordValid]
  ] = usePassword();

  const _onChangePassword = (password: string): void => {
    setPassword(password);
  };

  const _onSubmit = (): void => {
    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      action: 'backup'
    };

    try {
      const addressKeyring = address && keyring.getPair(address);
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      status.account = address;
      status.status = blob ? 'success' : 'error';
      status.message = t('account backed up');

      FileSaver.saveAs(blob, `${address}.json`);
    } catch (error) {
      setIsPasswordValid(false);
      console.error(error);

      status.status = 'error';
      status.message = error.message;
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
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
          <p>{t('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
          <div>
            <Password
              help={t('The account password as specified when creating the account. This is used to encrypt the backup file and subsequently decrypt it when restoring the account.')}
              isError={!isPasswordValid}
              label={t('password')}
              onChange={_onChangePassword}
              onEnter={onInputEnterKey}
              onEscape={onInputEscapeKey}
              tabIndex={0}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
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
            onClick={_onSubmit}
            ref={submitButtonRef}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(Backup);
