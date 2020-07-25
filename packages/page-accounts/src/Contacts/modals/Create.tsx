// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps as Props } from '../../types';

import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface AddrState {
  address: string;
  addressInput: string;
  isAddressExisting: boolean;
  isAddressValid: boolean;
}

interface NameState {
  isNameValid: boolean;
  name: string;
}

function Create ({ onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState<NameState>({ isNameValid: false, name: '' });
  const [{ address, addressInput, isAddressExisting, isAddressValid }, setAddress] = useState<AddrState>({ address: '', addressInput: '', isAddressExisting: false, isAddressValid: false });
  const isValid = isAddressValid && isNameValid;

  const _onChangeAddress = useCallback(
    (addressInput: string): void => {
      let address = '';
      let isAddressValid = true;
      let isAddressExisting = false;

      try {
        address = keyring.encodeAddress(
          keyring.decodeAddress(addressInput)
        );
        isAddressValid = keyring.isAvailable(address);

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

      setAddress({ address: isAddressValid ? address : '', addressInput, isAddressExisting, isAddressValid });
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

      if (!isValid) {
        return;
      }

      try {
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
    [address, isAddressExisting, isValid, name, onClose, onStatusChange, t]
  );

  return (
    <Modal header={t<string>('Add an address')}>
      <Modal.Content>
        <AddressRow
          defaultName={name}
          noDefaultNameOpacity
          value={address}
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
