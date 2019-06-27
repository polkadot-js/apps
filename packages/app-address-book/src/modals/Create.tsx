// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { ModalProps } from '../types';

import React from 'react';

import { AddressRow, Button, Input, Modal } from '@polkadot/ui-app';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = ModalProps & I18nProps;

type State = {
  address: string,
  isAddressExisting: boolean,
  isAddressValid: boolean,
  isNameValid: boolean,
  isValid: boolean,
  name: string,
  tags: Array<string>
};

class Create extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render () {
    const { t } = this.props;

    return (
      <Modal
        dimmer='inverted'
        open
      >
        <Modal.Header>{t('Add an address')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { t } = this.props;
    const { isValid } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onDiscard}
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onCommit}
            label={t('Save')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { t } = this.props;
    const { address, isAddressValid, isNameValid, name } = this.state;

    return (
      <Modal.Content>
        <AddressRow
          defaultName={name}
          value={address}
        >
          <Input
            autoFocus
            className='full'
            help={t('Paste here the address of the contact you want to add to your address book.')}
            isError={!isAddressValid}
            label={t('address')}
            onChange={this.onChangeAddress}
            onEnter={this.onCommit}
            value={address}
          />
          <Input
            className='full'
            help={t('Type the name of your contact. This name will be used across all the apps. It can be edited later on.')}
            isError={!isNameValid}
            label={t('name')}
            onChange={this.onChangeName}
            onEnter={this.onCommit}
            value={name}
          />
        </AddressRow>
      </Modal.Content>
    );
  }

  private emptyState (): State {
    return {
      address: '',
      isAddressExisting: false,
      isAddressValid: false,
      isNameValid: true,
      isValid: false,
      name: 'new address',
      tags: []
    };
  }

  private nextState (newState: State, allowEdit: boolean = false): void {
    this.setState(
      (prevState: State): State => {
        let { address = prevState.address, name = prevState.name, tags = prevState.tags } = newState;
        let isAddressValid = true;
        let isAddressExisting = false;
        let newAddress = address;

        try {
          newAddress = keyring.encodeAddress(
            keyring.decodeAddress(address)
          );
          isAddressValid = keyring.isAvailable(newAddress);

          if (!isAddressValid) {
            const old = keyring.getAddress(newAddress);

            if (old) {
              if (!allowEdit) {
                name = old.meta.name || name;
              }

              isAddressExisting = true;
              isAddressValid = true;
            }
          }
        } catch (error) {
          isAddressValid = false;
        }

        const isNameValid = !!name;

        return {
          address: newAddress,
          isAddressExisting,
          isAddressValid,
          isNameValid,
          isValid: isAddressValid && isNameValid,
          name,
          tags
        };
      }
    );
  }

  private onChangeAddress = (address: string): void => {
    this.nextState({ address } as State);
  }

  private onChangeName = (name: string): void => {
    this.nextState({ name } as State, true);
  }

  private onCommit = (): void => {
    const { onClose, onStatusChange, t } = this.props;
    const { address, isAddressExisting, isValid, name, tags } = this.state;
    const status = { action: 'create' } as ActionStatus;

    if (!isValid) {
      return;
    }

    try {
      keyring.saveAddress(address, { name, tags });

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
  }

  private onDiscard = (): void => {
    const { onClose } = this.props;

    onClose();
  }
}

export default translate(Create);
