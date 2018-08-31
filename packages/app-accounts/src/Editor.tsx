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

import DownloadButton from './DownloadButton';
import translate from './translate';

type Props = I18nProps & {
  current: KeyringPair | null,
  editedName: string,
  isEdited: boolean,
  onChangeAccount: () => void,
  onChangeName: () => void,
  onCommit: () => void,
  onDiscard: () => void,
  onForget: () => void,
  previous: KeyringPair | null
};

class Editor extends React.PureComponent<Props> {
  render () {
    return (
      <div className='accounts--Editor'>
        {this.renderData()}
        {this.renderButtons()}
      </div>
    );
  }

  renderButtons () {
    const { current, isEdited, onCommit, onDiscard, onForget, t } = this.props;

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
          onClick={onDiscard}
          text={t('editor.reset', {
            defaultValue: 'Reset'
          })}
        />
        <Button.Or />
        <Button
          isDisabled={!isEdited}
          isPrimary
          onClick={onCommit}
          text={t('editor.save', {
            defaultValue: 'Save'
          })}
        />
      </Button.Group>
    );
  }

  renderData () {
    const { current, editedName, onChangeAccount, onChangeName, t } = this.props;

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
              onChange={onChangeName}
              value={editedName}
            />
          </div>
        </div>
      </div>
    );
  }
}

export {
  Editor
};

export default translate(Editor);
