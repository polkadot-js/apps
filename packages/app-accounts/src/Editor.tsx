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

import DownloadButton from './DownloadButton';
import translate from './translate';

type Props = I18nProps & {
  current: KeyringPair | null,
  onChangeAccount: () => void,
  onForget: () => void,
  previous: KeyringPair | null
};

type State = {
  editedName: string,
  isEdited: boolean
};

class Editor extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.createState();
  }

  render () {
    return (
      <div className='accounts--Editor'>
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { current, onForget, t } = this.props;
    const { isEdited } = this.state;

    if (!current) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={onForget}
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
    const { current, onChangeAccount, t } = this.props;
    const { editedName } = this.state;

    const address = current ? current.address() : undefined;

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
              onChange={onChangeAccount}
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

  createState (): State {
    const { current } = this.props;

    return {
      editedName: current
        ? current.getMeta().name || ''
        : '',
      isEdited: false
    };
  }

  nextState (newState: State = {} as State): void {
    const { current, previous } = this.props;

    this.setState(
      (prevState: State): State => {
        let { editedName = prevState.editedName } = newState;
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

        return {
          editedName,
          isEdited
        };
      }
    );
  }

  onChangeName = (editedName: string): void => {
    this.nextState({ editedName } as State);
  }

  onCommit = (): void => {
    const { current } = this.props;
    const { editedName } = this.state;

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
    const { current } = this.props;

    if (!current) {
      return;
    }

    this.nextState({
      editedName: current.getMeta().name
    } as State);
  }
}

export {
  Editor
};

export default translate(Editor);
