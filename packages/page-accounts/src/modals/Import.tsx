// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import React, { useCallback, useState } from 'react';
import { AddressRow, Button, InputAddress, InputFile, Modal, Password } from '@polkadot/react-components';
import { hexToU8a, isHex, isObject, u8aToString } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';
import ExternalWarning from './ExternalWarning';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
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
    const json = JSON.parse(u8aToString(file)) as KeyringPair$Json;
    const publicKey = isHex(json.address)
      ? hexToU8a(json.address)
      : keyring.decodeAddress(json.address, true);
    const address = keyring.encodeAddress(
      isHex(json.address) && Array.isArray(json.encoding.content) && publicKey.length !== 32
        ? json.encoding.content[1] === 'ecdsa'
          ? blake2AsU8a(publicKey)
          // FIXME Handle Ethereum
          : publicKey
        : publicKey
    );
    const isFileValid = [32, 33].includes(publicKey.length) && !!json.encoded && isObject(json.meta) && (
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

function Import ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [{ address, isFileValid, json }, setFile] = useState<FileState>({ address: null, isFileValid: false, json: null });
  const [{ isPassValid, password }, setPass] = useState<PassState>({ isPassValid: false, password: '' });

  const _onChangeFile = useCallback(
    (file: Uint8Array) => setFile(parseFile(file)),
    []
  );

  const _onChangePass = useCallback(
    (password: string) => setPass({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onSave = useCallback(
    (): void => {
      if (!json) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        const status: Partial<ActionStatus> = { action: 'restore' };

        try {
          const pair = keyring.restoreAccount(json, password);
          const { address } = pair;

          status.status = pair ? 'success' : 'error';
          status.account = address;
          status.message = t<string>('account restored');

          InputAddress.setLastValue('account', address);
        } catch (error) {
          setPass((state: PassState) => ({ ...state, isPassValid: false }));

          status.status = 'error';
          status.message = (error as Error).message;
          console.error(error);
        }

        setIsBusy(false);
        onStatusChange(status as ActionStatus);

        if (status.status !== 'error') {
          onClose();
        }
      }, 0);
    },
    [json, onClose, onStatusChange, password, t]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add via backup file')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <AddressRow
              defaultName={(isFileValid && json?.meta.name as string) || null}
              noDefaultNameOpacity
              value={isFileValid && address ? address : null}
            />
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputFile
              accept={acceptedFormats}
              className='full'
              help={t<string>('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
              isError={!isFileValid}
              label={t<string>('backup file')}
              onChange={_onChangeFile}
              withLabel
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Supply a backed-up JSON file, encrypted with your account-specific password.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Password
              autoFocus
              className='full'
              help={t<string>('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
              isError={!isPassValid}
              label={t<string>('password')}
              onChange={_onChangePass}
              onEnter={_onSave}
              value={password}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The password previously used to encrypt this account.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <ExternalWarning />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!isFileValid || !isPassValid}
          label={t<string>('Restore')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Import);
