// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Input from '@polkadot/ui-app/src/Input';
import InputAddress from '@polkadot/ui-app/src/InputAddress';
import keyring from '@polkadot/ui-keyring/src';

import Address from '@polkadot/app-accounts/src/Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  currentAddress: KeyringAddress | null,
  defaultPublicKey?: Uint8Array,
  editedName: string,
  isEdited: boolean,
  info: KeyringAddress | null
}

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const addresses = keyring.getAddresses();
    const currentAddress = addresses[addresses.length - 1] || null;

    this.state = this.createState(currentAddress);
    this.state.defaultPublicKey = currentAddress
      ? currentAddress.publicKey()
      : void 0;
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { currentAddress, defaultPublicKey, editedName, isEdited } = this.state;

    if (!currentAddress) {
      return (
        <div
          className={['addresses--Editor', className].join(' ')}
          style={style}
        >
          {t('editor.none', {
            defaultValue: 'There are no saved addresses. Add some first.'
          })}
        </div>
      );
    }

    const address = currentAddress.address();

    return (
      <div
        className={['addresses--Editor', className].join(' ')}
        style={style}
      >
        <div className='ui--grid'>
          <Address
            className='shrink'
            value={address}
          />
          <div className='grow'>
            <div className='ui--row'>
              <InputAddress
                className='full'
                defaultValue={defaultPublicKey}
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
      </div>
    );
  }

  createState (currentAddress: KeyringAddress | null): $Shape<State> {
    const { name = '' } = currentAddress
      ? currentAddress.getMeta()
      : {};

    return {
      currentAddress,
      editedName: name,
      isEdited: false
    };
  }

  nextState (newState?: $Shape<State> = {}): void {
    this.setState(
      (prevState: State): $Shape<State> => {
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

    this.nextState({
      currentAddress
    });
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName });
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

    this.nextState({});
  }

  onDiscard = (): void => {
    const { currentAddress } = this.state;

    if (!currentAddress) {
      return;
    }

    this.nextState({
      editedName: currentAddress.getMeta().name
    });
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
    const defaultPublicKey = nextAddress
      ? nextAddress.publicKey()
      : void 0;

    keyring.forgetAddress(address);

    this.nextState({
      currentAddress: nextAddress,
      defaultPublicKey
    });
  }
}

export default translate(Editor);
