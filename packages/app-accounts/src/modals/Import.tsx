// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { I18nProps, StringOrNull, WithSubmittableButtonProps } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import React, { useState } from 'react';
import { AddressRow, Button, InputAddress, InputFile, Modal, Password, withSubmittableButton } from '@polkadot/react-components';
import { usePassword } from '@polkadot/react-hooks';
import { isHex, isObject, u8aToString } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends ModalProps, I18nProps, WithSubmittableButtonProps {}

const acceptedFormats = ['application/json', 'text/plain'].join(', ');

function Import (props: Props): React.ReactElement<Props> {
  const { onClose, onStatusChange, onTextEnterKey, submitButtonRef, t } = props;

  const [[address, json, isFileValid], setImport] = useState<[StringOrNull, KeyringPair$Json | null, boolean]>([null, null, false]);
  const [
    [password, setPassword],
    [isPasswordValid, setIsPasswordValid]
  ] = usePassword();

  const _onChangeFile = (file: Uint8Array): void => {
    try {
      const json = JSON.parse(u8aToString(file));
      const publicKey = keyring.decodeAddress(json.address, true);
      const address = keyring.encodeAddress(publicKey);
      const isFileValid = publicKey.length === 32 && isHex(json.encoded) && isObject(json.meta) && (
        Array.isArray(json.encoding.content)
          ? json.encoding.content[0] === 'pkcs8'
          : json.encoding.content === 'pkcs8'
      );

      setImport([address, json, isFileValid]);
    } catch (error) {
      setImport([null, null, false]);
      console.error(error);
    }
  };

  const _onChangePassword = (password: string): void => {
    setPassword(password);
  };

  const _onSubmit = (): void => {
    if (!json) {
      return;
    }

    const status: Partial<ActionStatus> = { action: 'restore' };

    try {
      const pair = keyring.restoreAccount(json, password);
      const { address } = pair;

      status.status = pair ? 'success' : 'error';
      status.account = address;
      status.message = t('account restored');

      InputAddress.setLastValue('account', address);
    } catch (error) {
      setIsPasswordValid(false);

      status.status = 'error';
      status.message = error.message;
      console.error(error);
    }

    onStatusChange(status as ActionStatus);

    if (status.status !== 'error') {
      onClose();
    }
  };

  return (
    <Modal
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Add via backup file')}</Modal.Header>
      <Modal.Content>
        <AddressRow
          defaultName={isFileValid && json ? json.meta.name : null}
          noDefaultNameOpacity
          value={isFileValid && address ? address : null}
        >
          <InputFile
            accept={acceptedFormats}
            className='full'
            help={t('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
            isError={!isFileValid}
            label={t('backup file')}
            onChange={_onChangeFile}
            withLabel
          />
          <Password
            autoFocus
            className='full'
            help={t('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
            isError={!isPasswordValid}
            label={t('password')}
            onChange={_onChangePassword}
            onEnter={onTextEnterKey}
            value={password}
          />
        </AddressRow>
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
          <Button
            icon='sync'
            isDisabled={!isFileValid || !isPasswordValid}
            isPrimary
            onClick={_onSubmit}
            label={t('Restore')}
            ref={submitButtonRef}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default withSubmittableButton(translate(Import));
