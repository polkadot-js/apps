// Copyright 2017-2019 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';

import { AddressSummary, Button, Input } from '@polkadot/ui-app/index';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring';

import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  address: string,
  isAddressExisting: boolean,
  isAddressValid: boolean,
  isNameValid: boolean,
  isValid: boolean,
  name: string
};

class Creator extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render () {
    const { address } = this.state;

    return (
      <div className='addresses--Creator'>
        <div className='ui--grid'>
          <AddressSummary
            className='shrink'
            value={address}
          />
          {this.renderInput()}
        </div>
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { isValid } = this.state;

    return (
      <Button.Group>
        <Button
          onClick={this.onDiscard}
          label={t('Reset')}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          onClick={this.onCommit}
          label={t('Save')}
        />
      </Button.Group>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { address, isAddressValid, isNameValid, name } = this.state;

    return (
      <div className='grow'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            isError={!isAddressValid}
            label={t('add the following address')}
            onChange={this.onChangeAddress}
            value={address}
          />
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            isError={!isNameValid}
            label={t('name the entry')}
            onChange={this.onChangeName}
            value={name}
          />
        </div>
      </div>
    );
  }

  emptyState (): State {
    return {
      address: '',
      isAddressExisting: false,
      isAddressValid: false,
      isNameValid: true,
      isValid: false,
      name: 'new address'
    };
  }

  nextState (newState: State, allowEdit: boolean = false): void {
    this.setState(
      (prevState: State, props: Props): State => {
        let { address = prevState.address, name = prevState.name } = newState;

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

            if (old.isValid) {
              if (!allowEdit) {
                name = old.getMeta().name || name;
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
          name
        };
      }
    );
  }

  onChangeAddress = (address: string): void => {
    this.nextState({ address } as State);
  }

  onChangeName = (name: string): void => {
    this.nextState({ name } as State, true);
  }

  onCommit = (): void => {
    const { basePath, onStatusChange, t } = this.props;
    const { address, isAddressExisting, name } = this.state;

    const status = {
      action: 'create'
    } as ActionStatus;

    try {
      keyring.saveAddress(address, { name });

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

    if (status.status !== 'error') {
      window.location.hash = basePath;
    }
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);
