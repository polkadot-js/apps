// Copyright 2017-2018 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring/index';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import translate from './translate';

type Props = I18nProps & {
  onCreateAddress: () => void
};

type State = {
  address: string,
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
          text={t('creator.discard', {
            defaultValue: 'Reset'
          })}
        />
        <Button.Or />
        <Button
          isDisabled={!isValid}
          isPrimary
          onClick={this.onCommit}
          text={t('creator.save', {
            defaultValue: 'Save'
          })}
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
            label={t('creator.address', {
              defaultValue: 'add the following address'
            })}
            onChange={this.onChangeAddress}
            value={address}
          />
        </div>
        <div className='ui--row'>
          <Input
            className='full'
            isError={!isNameValid}
            label={t('creator.name', {
              defaultValue: 'name the entry'
            })}
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
      isAddressValid: false,
      isNameValid: true,
      isValid: false,
      name: 'new address'
    };
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const { address = prevState.address, name = prevState.name } = newState;

        let isAddressValid = true;
        let newAddress = address;

        try {
          newAddress = addressEncode(
            addressDecode(address)
          );
          isAddressValid = keyring.isAvailable(newAddress);
        } catch (error) {
          isAddressValid = false;
        }

        const isNameValid = !!name;

        return {
          address: newAddress,
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
    this.nextState({ name } as State);
  }

  onCommit = (): void => {
    const { onCreateAddress } = this.props;
    const { address, name } = this.state;

    keyring.saveAddress(address, { name });
    InputAddress.setLastValue('address', address);

    onCreateAddress();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);
