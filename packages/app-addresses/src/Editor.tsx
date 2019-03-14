// Copyright 2017-2019 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { AddressSummary, Button, Input, InputAddress } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import Forgetting from './Forgetting';
import translate from './translate';

type Props = ComponentProps & I18nProps;

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
              label={t('edit the selected address')}
              onChange={this.onChangeAddress}
              type='address'
              value={address}
            />
          </div>
          <div className='ui--row'>
            <Input
              className='full'
              label={t('identified by the name')}
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

  onChangeAddress = (accountId: string): void => {
    const current = accountId && keyring.decodeAddress(accountId)
      ? (keyring.getAddress(accountId) || null)
      : null;

    this.nextState({ current } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { current, editedName } = this.state;
    const { onStatusChange, t } = this.props;

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
        whenEdited: Date.now()
      });

      status.status = current.getMeta().name === editedName ? 'success' : 'error';
      status.message = t('name edited');
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
