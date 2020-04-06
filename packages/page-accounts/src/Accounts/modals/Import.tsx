// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../../types';

import React, { useCallback, useState } from 'react';
import { AddressRow, Button, InputAddress, InputFile, Modal, Password } from '@polkadot/react-components';
import { isHex, isObject, u8aToString } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface Props extends ModalProps {
  className?: string;
}

interface FileState {
  address: string | null;
  isFileValid: boolean;
  json: KeyringPair$Json | null;
}

interface PassState {
  isPassValid: boolean;
  password: string;
}

const acceptedFormats = ['application/json', 'text/plain'].join(', ');

function parseFile (file: Uint8Array): FileState {
  try {
    const json = JSON.parse(u8aToString(file));
    const publicKey = keyring.decodeAddress(json.address, true);
    const address = keyring.encodeAddress(publicKey);
    const isFileValid = publicKey.length === 32 && isHex(json.encoded) && isObject(json.meta) && (
      Array.isArray(json.encoding.content)
        ? json.encoding.content[0] === 'pkcs8'
        : json.encoding.content === 'pkcs8'
    );

    return { address, isFileValid, json };
  } catch (error) {
    console.error(error);
  }

  return { address: null, isFileValid: false, json: null };
}

function Import ({ className, onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ address, isFileValid, json }, setFile] = useState<FileState>({ address: null, isFileValid: false, json: null });
  const [{ isPassValid, password }, setPass] = useState<PassState>({ isPassValid: false, password: '' });

  const _onChangeFile = useCallback(
    (file: Uint8Array): void =>
      setFile(parseFile(file)),
    []
  );

  const _onChangePass = useCallback(
    (password: string): void =>
      setPass({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onSave = useCallback(
    (): void => {
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
        setPass((state: PassState) => ({ ...state, isPassValid: false }));

        status.status = 'error';
        status.message = error.message;
        console.error(error);
      }

      onStatusChange(status as ActionStatus);

      if (status.status !== 'error') {
        onClose();
      }
    },
    [json, onClose, onStatusChange, password, t]
  );

  return (
    <Modal
      className={className}
      header={t('Add via backup file')}
    >
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
            isError={!isPassValid}
            label={t('password')}
            onChange={_onChangePass}
            onEnter={_onSave}
            value={password}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sync'
          isDisabled={!isFileValid || !isPassValid}
          isPrimary
          label={t('Restore')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Import);
