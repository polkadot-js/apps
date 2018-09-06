// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import keyring from '@polkadot/ui-keyring/index';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import DownloadButton from './DownloadButton';
import Forgetting from './Forgetting';
import translate from './translate';

type Props = I18nProps & {
  accountAll?: Array<any>,
  onChangeAccount: () => void
};

type State = {
  current: KeyringPair | null,
  editedName: string,
  isEdited: boolean,
  isForgetOpen: boolean,
  previous: KeyringPair | null
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState(null, null);
  }

  render () {
    const { isForgetOpen } = this.state;
    return (
      <div className='accounts--Editor'>
        <Forgetting
          isOpen={isForgetOpen}
          onClose={this.toggleForget}
          doForget={this.onForget}
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
      <div className='accounts--flex-group-row'>
        <div className='accounts--flex-container-col-summary'>
          <div className='accounts--flex-item'>
            <AddressSummary
              buttonChildren={<DownloadButton address={address} />}
              className='shrink'
              value={address}
            />
          </div>
        </div>
        <div className='accounts--flex-container-col-inputs'>
          <div className='accounts--flex-item'>
            <InputAddress
              className='full'
              hideAddress
              isInput={false}
              label={t('editor.select', {
                defaultValue: 'using my account'
              })}
              onChange={this.onChangeAccount}
              type='account'
              value={address}
            />
          </div>
          <div className='accounts--flex-item'>
            <Input
              className='full'
              isEditable
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

  createState (current: KeyringPair | null, previous: KeyringPair | null): State {
    return {
      current,
      editedName: current
        ? current.getMeta().name || ''
        : '',
      isEdited: false,
      isForgetOpen: false,
      previous
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let {
          current = prevState.current,
          editedName = prevState.editedName
        } = newState;

        const previous = prevState.current || null;
        const previousPair = previous || { address: () => undefined };
        let isEdited = false;

        if (current) {
          if (current.address() !== previousPair.address()) {
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
          isForgetOpen,
          previous
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const { onChangeAccount } = this.props;

    const current = publicKey && publicKey.length === 32
      ? keyring.getPair(publicKey)
      : null;

    this.nextState({
      current
    } as State);

    onChangeAccount();
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { current, editedName } = this.state;

    if (!current) {
      return;
    }

    keyring.saveAccountMeta(current, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({} as State);
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
      this.createState(null, null),
      () => {
        keyring.forgetAccount(
          current.address()
        );
      }
    );
  }
}

export {
  Editor
};

export default withObservableBase(
  accountObservable.subject, { propName: 'accountAll' }
)(translate(Editor));
