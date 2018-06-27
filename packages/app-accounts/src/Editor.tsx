// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';

import Address from './Address';
import translate from './translate';

type Props = I18nProps & {
  onBack: () => void
};

type State = {
  currentPair: KeyringPair | null,
  defaultValue?: string,
  editedName: string,
  isEdited: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const pairs = keyring.getPairs();
    const currentPair = pairs[pairs.length - 1] || null;

    this.state = this.createState(currentPair);
    this.state.defaultValue = currentPair
      ? currentPair.address()
      : void 0;
  }

  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('accounts--Editor', className)}
        style={style}
      >
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { currentPair, isEdited } = this.state;

    if (!currentPair) {
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
    const { currentPair, defaultValue, editedName } = this.state;

    if (!currentPair) {
      return t('editor.none', {
        defaultValue: 'There are no saved accounts. Add some first.'
      });
    }

    const address = currentPair.address();

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
                defaultValue: 'using my account'
              })}
              onChange={this.onChangeAccount}
              type='account'
              value={address}
            />
          </div>
          <div className='ui--row'>
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

  createState (currentPair: KeyringPair | null): State {
    return {
      currentPair,
      editedName: currentPair
        ? currentPair.getMeta().name || ''
        : '',
      isEdited: false
    };
  }

  nextState (newState: State = {} as State): void {
    this.setState(
      (prevState: State): State => {
        let { currentPair = prevState.currentPair, editedName = prevState.editedName } = newState;
        const previous = prevState.currentPair || { address: () => null };
        let isEdited = false;

        if (currentPair) {
          if (currentPair.address() !== previous.address()) {
            editedName = currentPair.getMeta().name || '';
          } else if (editedName !== currentPair.getMeta().name) {
            isEdited = true;
          }
        } else {
          editedName = '';
        }

        return {
          currentPair,
          editedName,
          isEdited
        };
      }
    );
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const currentPair = keyring.getPair(publicKey);

    this.nextState({
      currentPair
    } as State);
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { currentPair, editedName } = this.state;

    if (!currentPair) {
      return;
    }

    keyring.saveAccountMeta(currentPair, {
      name: editedName,
      whenEdited: Date.now()
    });

    this.nextState({} as State);
  }

  onDiscard = (): void => {
    const { currentPair } = this.state;

    if (!currentPair) {
      return;
    }

    this.nextState({
      editedName: currentPair.getMeta().name
    } as State);
  }

  onForget = (): void => {
    const { currentPair } = this.state;

    if (!currentPair) {
      return;
    }

    const address = currentPair.address();
    const pairs = keyring.getPairs().filter((item) =>
      item.address() !== address
    );
    const nextPair = pairs[pairs.length - 1] || null;
    const defaultValue = nextPair
      ? nextPair.address()
      : void 0;

    keyring.forgetAccount(address);

    this.nextState({
      currentPair: nextPair,
      defaultValue
    } as State);
  }
}

export default translate(Editor);
