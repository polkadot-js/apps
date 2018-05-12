// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Input from '@polkadot/ui-app/src/Input';
import keyring from '@polkadot/ui-keyring/src';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import Address from '@polkadot/app-accounts/src/Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  address: string,
  isAddressValid: boolean,
  isNameValid: boolean,
  isValid: boolean,
  name: string
}

class Creator extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { address, isAddressValid, isNameValid, isValid, name } = this.state;

    return (
      <div
        className={['addresses--Creator', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <Address
            className='shrink'
            value={address}
          />
          <div className='grow'>
            <div className='ui--row'>
              <Input
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
        </div>
        <Button.Group>
          <Button
            onClick={this.onDiscard}
            text={t('creator.discard', {
              defaultValue: 'Reset'
            })}
          />
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onCommit}
            text={t('creator.save', {
              defaultValue: 'Save'
            })}
          />
        </Button.Group>
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

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State, props: Props): $Shape<State> => {
        const { address = prevState.address, name = prevState.name } = newState;

        let isAddressValid = true;

        try {
          addressEncode(
            addressDecode(address)
          );
        } catch (error) {
          isAddressValid = false;
        }

        const isNameValid = !!name;

        return {
          address,
          isAddressValid,
          isNameValid,
          isValid: isAddressValid && isNameValid,
          name
        };
      }
    );
  }

  onChangeAddress = (address: string): void => {
    this.nextState({ address });
  }

  onChangeName = (name: string): void => {
    this.nextState({ name });
  }

  onCommit = (): void => {
    const { onBack } = this.props;
    const { address, name } = this.state;

    keyring.saveAddress(address, { name });

    onBack();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(Creator);
