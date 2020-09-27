// Copyright 2017-2020 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountInfo } from '@polkadot/api-derive/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps as Props } from '../types';

import React, { useCallback, useState } from 'react';
import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface AddrState {
  address: string;
  addressInput: string;
  isAddressExisting: boolean;
  isAddressValid: boolean;
  isPublicKey: boolean;
}

interface NameState {
  isNameValid: boolean;
  name: string;
}

function Create ({ onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ isNameValid, name }, setName] = useState<NameState>({ isNameValid: false, name: '' });
  const [{ address, addressInput, isAddressExisting, isAddressValid }, setAddress] = useState<AddrState>({ address: '', addressInput: '', isAddressExisting: false, isAddressValid: false, isPublicKey: false });
  const info = useCall<DeriveAccountInfo>(!!address && isAddressValid && api.derive.accounts.info, [address]);
  const isValid = (isAddressValid && isNameValid) && !!info?.accountId;

  const _onChangeAddress = useCallback(
    (addressInput: string): void => {
      let address = '';
      let isAddressValid = true;
      let isAddressExisting = false;
      let isPublicKey = false;

      try {
        const publicKey = keyring.decodeAddress(addressInput);

        address = keyring.encodeAddress(publicKey);
        isAddressValid = keyring.isAvailable(address);
        isPublicKey = publicKey.length === 32;

        if (!isAddressValid) {
          const old = keyring.getAddress(address);

          if (old) {
            const newName = old.meta.name || name;

            isAddressExisting = true;
            isAddressValid = true;

            setName({ isNameValid: !!(newName || '').trim(), name: newName });
          }
        }
      } catch (error) {
        isAddressValid = false;
      }

      setAddress({ address: isAddressValid ? address : '', addressInput, isAddressExisting, isAddressValid, isPublicKey });
    },
    [name]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onCommit = useCallback(
    (): void => {
      const status = { action: 'create' } as ActionStatus;

      if (!isValid || !info?.accountId) {
        return;
      }

      try {
        const address = info.accountId.toString();

        keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name.trim(), tags: [] });

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = isAddressExisting
          ? t<string>('address edited')
          : t<string>('address created');

        InputAddress.setLastValue('address', address);
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      onStatusChange(status);
      onClose();
    },
    [info, isAddressExisting, isValid, name, onClose, onStatusChange, t]
  );

  return (
    <Modal header={t<string>('Add an address')}>
      <Modal.Content>
        <AddressRow
          defaultName={name}
          noDefaultNameOpacity
          value={
            isAddressValid
              ? info?.accountId?.toString()
              : undefined
          }
        >
          <Input
            autoFocus
            className='full'
            help={t<string>('Paste here the address of the contact you want to add to your address book.')}
            isError={!isAddressValid}
            label={t<string>('address')}
            onChange={_onChangeAddress}
            onEnter={_onCommit}
            placeholder={t<string>('new address')}
            value={addressInput}
          />
          <Input
            className='full'
            help={t<string>('Type the name of your contact. This name will be used across all the apps. It can be edited later on.')}
            isError={!isNameValid}
            label={t<string>('name')}
            onChange={_onChangeName}
            onEnter={_onCommit}
            value={name}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='save'
          isDisabled={!isValid}
          label={t<string>('Save')}
          onClick={_onCommit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
