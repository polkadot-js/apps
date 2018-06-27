// Copyright 2017-2018 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';

import Address from '@polkadot/app-accounts/Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  currentAddress: KeyringAddress | null,
  defaultValue?: string,
  editedName: string,
  isEdited: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const addresses = keyring.getAddresses();
    const currentAddress = addresses[addresses.length - 1] || null;

    this.state = this.createState(currentAddress);
    this.state.defaultValue = currentAddress
      ? currentAddress.address()
      : void 0;
  }

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('addresses--Editor', className)}
        style={style}
      >
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { currentAddress, isEdited } = this.state;

    if (!currentAddress) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.onForget}
          text={t('editor.forget', {
            defaultValue: 'Forget'
          })}
        />
        <Button.Group.Divider />
        <Button
          isDisabled={!isEdited}
          onClick={this.onDiscard}
          text={t('editor.reset', {
            defaultValue: 'Reset'
          })}
        />
        <Button
          isDisabled={!isEdited}
          isPrimary
          onClick={this.onCommit}
          text={t('editor.save', {
            defaultValue: 'Save'
          })}
        />
      </Button.Group>
    );
  }

  renderData () {
    const { t } = this.props;
    const { currentAddress, defaultValue, editedName } = this.state;

    if (!currentAddress) {
      return t('editor.none', {
        defaultValue: 'There are no saved addresses. Add some first.'
      });
    }

    const address = currentAddress.address();

    return (
      <div className='ui--grid'>
        <Address
          className='shrink'
          value={address}
        />
        <div className='grow'>
          <div className='ui--row'>
            <InputAddress
              className='full'
              defaultValue={defaultValue}
              hideAddress
              isInput={false}
              label={t('editor.select', {
                defaultValue: 'edit the selected address'
              })}
              onChange={this.onChangeAddress}
              type='address'
              value={address}
            />
          </div>
          <div className='ui--row'>
            <Input
              className='full'
              label={t('editor.name', {
                defaultValue: 'identified by the name'
              })}
              onChange={this.onChangeName}
              value={editedName}
            />
          </div>
        </div>
      </div>
    );
  }

  createState (currentAddress: KeyringAddress | null): State {
    const { name = '' } = currentAddress
      ? currentAddress.getMeta()
      : {};

    return {
      currentAddress,
      editedName: name,
      isEdited: false
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { currentAddress = prevState.currentAddress, editedName = prevState.editedName } = newState;
        const previous = prevState.currentAddress || { address: () => null };
        let isEdited = false;

        if (currentAddress && currentAddress.isValid()) {
          if (currentAddress.address() !== previous.address()) {
            editedName = currentAddress.getMeta().name || '';
          } else if (editedName !== currentAddress.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          currentAddress,
          editedName,
          isEdited
        };
      }
    );
  }

  onChangeAddress = (publicKey: Uint8Array): void => {
    const currentAddress = keyring.getAddress(publicKey) || null;

    this.nextState({ currentAddress } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { currentAddress, editedName } = this.state;

    if (!currentAddress) {
      return;
    }

    keyring.saveAddress(currentAddress.address(), {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({} as State);
  }

  onDiscard = (): void => {
    const { currentAddress } = this.state;

    if (!currentAddress) {
      return;
    }

    this.nextState({
      editedName: currentAddress.getMeta().name
    } as State);
  }

  onForget = (): void => {
    const { currentAddress } = this.state;

    if (!currentAddress) {
      return;
    }

    const address = currentAddress.address();
    const addresses = keyring.getAddresses().filter((item) =>
      item.address() !== address
    );
    const nextAddress = addresses[0] || null;
    const defaultValue = nextAddress
      ? nextAddress.address()
      : void 0;

    keyring.forgetAddress(address);

    this.nextState({
      currentAddress: nextAddress,
      defaultValue
    } as State);
  }
}

export default translate(Editor);
