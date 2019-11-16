// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../types';

import React, { useState } from 'react';

import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Props extends ModalProps, I18nProps {}

function Create ({ onClose, onStatusChange, t }: Props): React.ReactElement<Props> {
  const [{ isNameValid, name }, setName] = useState<{ isNameValid: boolean; name: string }>({ isNameValid: false, name: '' });
  const [{ address, isAddressExisting, isAddressValid }, setAddress] = useState<{ address: string; isAddressExisting: boolean; isAddressValid: boolean }>({ address: '', isAddressExisting: false, isAddressValid: false });
  const isValid = isAddressValid && isNameValid;

  const _onChangeAddress = (input: string): void => {
    let address = '';
    let isAddressValid = true;
    let isAddressExisting = false;

    try {
      address = keyring.encodeAddress(
        keyring.decodeAddress(input)
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

    setAddress({ address: address || input, isAddressExisting, isAddressValid });
  };
  const _onChangeName = (name: string): void => setName({ isNameValid: !!name.trim(), name });
  const _onCommit = (): void => {
    const status = { action: 'create' } as ActionStatus;

    if (!isValid) {
      return;
    }

    try {
      keyring.saveAddress(address, { name: name.trim(), genesisHash: keyring.genesisHash, tags: [] });

      status.account = address;
      status.status = address ? 'success' : 'error';
      status.message = isAddressExisting
        ? t('address edited')
        : t('address created');

      InputAddress.setLastValue('address', address);
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    onStatusChange(status);
    onClose();
  };

  return (
    <Modal
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Add an address')}</Modal.Header>
      <Modal.Content>
        <AddressRow
          defaultName={name}
          noDefaultNameOpacity
          value={address}
        >
          <Input
            autoFocus
            className='full'
            help={t('Paste here the address of the contact you want to add to your address book.')}
            isError={!isAddressValid}
            label={t('address')}
            onChange={_onChangeAddress}
            onEnter={_onCommit}
            placeholder={t('new address')}
            value={address}
          />
          <Input
            className='full'
            help={t('Type the name of your contact. This name will be used across all the apps. It can be edited later on.')}
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            onEnter={_onCommit}
            value={name}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            onClick={onClose}
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            icon='save'
            isDisabled={!isValid}
            isPrimary
            onClick={_onCommit}
            label={t('Save')}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(Create);
