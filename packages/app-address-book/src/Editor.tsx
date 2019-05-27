// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { AddressRow, Button, Input, InputAddress, InputTags, TxComponent } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import Forgetting from './Forgetting';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  current: KeyringAddress | null,
  editedName: string,
  isEdited: boolean,
  isForgetOpen: boolean,
  tags: Array<string>
};

class Editor extends TxComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null);
  }

  render () {
    const { isForgetOpen, current } = this.state;
    return (
      <div className='address-book--Editor'>
        <Forgetting
          isOpen={isForgetOpen}
          onClose={this.toggleForget}
          doForget={this.onForget}
          currentAddress={current}
        />
        {this.renderData()}
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
          label={t('Forget')}
        />
        <Button.Group.Divider />
        <Button
          isDisabled={!isEdited}
          onClick={this.onDiscard}
          label={t('Reset')}
        />
        <Button.Or />
        <Button
          isDisabled={!isEdited}
          isPrimary
          onClick={this.onCommit}
          label={t('Save')}
          ref={this.button}
        />
      </Button.Group>
    );
  }

  renderData () {
    const { t } = this.props;
    const { current, editedName, tags } = this.state;

    const address = current
      ? current.address()
      : undefined;

    return (
      <div className='ui--grid'>
        <div className='grow'>
          <div className='ui--row'>
            <InputAddress
              className='full'
              help={t('Select the contact you want to edit or forget.')}
              hideAddress
              isInput={false}
              label={t('contact')}
              onChange={this.onChangeAddress}
              type='address'
              value={address}
            />
          </div>
          <div className='ui--row'>
            <Input
              className='full'
              help={t('Name associated with the selected contact. You can change it here. This name will be changed across all the apps.')}
              label={t('name')}
              onChange={this.onChangeName}
              onEnter={this.submit}
              value={editedName}
            />
          </div>
          <div className='ui--row'>
            <InputTags
              help={t('Additional user-specified tags that can be used to identify the address. Tags can be used for categorization and filtering.')}
              label={t('user-defined tags')}
              onChange={this.onChangeTags}
              value={tags}
            />
          </div>
          {this.renderButtons()}
        </div>
        <AddressRow
          className='shrink'
          value={address || ''}
        />
      </div>
    );
  }

  createState (current: KeyringAddress | null): State {
    const meta = current
      ? current.getMeta()
      : {};

    return {
      current,
      editedName: meta.name || '',
      isEdited: false,
      isForgetOpen: false,
      tags: meta.tags || []
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { current = prevState.current, editedName = prevState.editedName, tags = prevState.tags } = newState;
        const previous = prevState.current || { address: () => null };
        let isEdited = false;

        if (current && current.isValid()) {
          const meta = current.getMeta();

          if (current.address() !== previous.address()) {
            editedName = meta.name || '';
            tags = meta.tags || [];
          } else if (editedName !== meta.name) {
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
          isForgetOpen,
          tags
        };
      }
    );
  }

  onChangeAddress = (accountId: string): void => {
    const current = accountId && keyring.decodeAddress(accountId)
      ? (keyring.getAddress(accountId) || null)
      : null;

    this.nextState({ current } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onChangeTags = (tags: Array<string>): void => {
    this.setState({ isEdited: true, tags });
  }

  onCommit = (): void => {
    const { onStatusChange, t } = this.props;
    const { current, editedName, tags } = this.state;

    if (!current) {
      return;
    }

    const status = {
      account: current.address(),
      action: 'edit'
    } as ActionStatus;

    try {
      keyring.saveAddress(current.address(), {
        name: editedName,
        tags,
        whenEdited: Date.now()
      });

      status.status = current.getMeta().name === editedName ? 'success' : 'error';
      status.message = t('address edited');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    onStatusChange(status);
  }

  onDiscard = (): void => {
    const { current } = this.state;

    if (!current) {
      return;
    }

    const meta = current.getMeta();

    this.nextState({
      editedName: meta.name,
      tags: meta.tags || []
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
    const { onStatusChange, t } = this.props;
    const { current } = this.state;

    if (!current) {
      return;
    }

    this.setState(
      this.createState(null),
      () => {
        const status = {
          account: current.address(),
          action: 'forget'
        } as ActionStatus;

        try {
          keyring.forgetAddress(
            current.address()
          );
          status.status = 'success';
          status.message = t('address forgotten');
        } catch (error) {
          status.status = 'error';
          status.message = error.message;
        }

        onStatusChange(status);
      }
    );
  }
}

export default translate(Editor);
