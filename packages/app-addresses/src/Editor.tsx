// Copyright 2017-2018 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import InputAddress from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring/index';

import Forgetting from './Forgetting';
import translate from './translate';

type Props = I18nProps;

type State = {
  current: KeyringAddress | null,
  editedName: string,
  isEdited: boolean,
  isForgetOpen: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null);
  }

  render () {
    const { isForgetOpen, current } = this.state;
    return (
      <div className='addresses--Editor'>
        <Forgetting
          isOpen={isForgetOpen}
          onClose={this.toggleForget}
          doForget={this.onForget}
          currentAddress={current}
        />
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { current, isEdited } = this.state;

    if (!current) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.toggleForget}
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
        <Button.Or />
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
    const { current, editedName } = this.state;

    const address = current
      ? current.address()
      : undefined;

    return (
      <div className='ui--grid'>
        <AddressSummary
          className='shrink'
          value={address || ''}
        />
        <div className='grow'>
          <div className='ui--row'>
            <InputAddress
              className='full'
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

  createState (current: KeyringAddress | null): State {
    const { name = '' } = current
      ? current.getMeta()
      : {};

    return {
      current,
      editedName: name,
      isEdited: false,
      isForgetOpen: false
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { current = prevState.current, editedName = prevState.editedName } = newState;
        const previous = prevState.current || { address: () => null };
        let isEdited = false;

        if (current && current.isValid()) {
          if (current.address() !== previous.address()) {
            editedName = current.getMeta().name || '';
          } else if (editedName !== current.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }
        let isForgetOpen = false;

        return {
          current,
          editedName,
          isEdited,
          isForgetOpen
        };
      }
    );
  }

  onChangeAddress = (publicKey: Uint8Array): void => {
    const current = publicKey && publicKey.length === 32
      ? (keyring.getAddress(publicKey) || null)
      : null;

    this.nextState({ current } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { current, editedName } = this.state;

    if (!current) {
      return;
    }

    keyring.saveAddress(current.address(), {
      name: editedName,
      whenEdited: Date.now()
    });
  }

  onDiscard = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.nextState({
      editedName: current.getMeta().name
    } as State);
  }

  toggleForget = (): void => {
    this.setState(
      ({ isForgetOpen }: State) => ({
        isForgetOpen: !isForgetOpen
      })
    );
  }

  onForget = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.setState(
      this.createState(null),
      () => {
        keyring.forgetAddress(
          current.address()
        );
      }
    );
  }
}

export default translate(Editor);
