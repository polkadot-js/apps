// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from '@polkadot/ui-app/Button/types';
import { BareProps, I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';
import FileSaver from 'file-saver';
import Button from '@polkadot/ui-app/Button';
import keyring from '@polkadot/ui-keyring/index';
import isUndefined from '@polkadot/util/is/undefined';

import DownloadModal from './DownloadModal';
import translate from './translate';

type State = {
  address: string,
  error?: React.ReactNode,
  isOpen: boolean,
  password: string
};

type Props = I18nProps & BareProps & {
  address: string | undefined,
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes
};

class DownloadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  static getDerivedStateFromProps ({ address }: Props, prevState: State): State {
    return {
      address
    } as State;
  }

  handleDownloadAccount = (): void => {
    const { t } = this.props;
    const { address, password } = this.state;

    if (!address) {
      return;
    }

    try {
      const json: KeyringPair$Json | void = keyring.backupAccount(address, password);

      if (!isUndefined(json)) {
        const blob = new Blob([JSON.stringify(json)], { type: 'text/plain;charset=utf-8' });

        FileSaver.saveAs(blob, `${address}.json`);

        this.hideModal();
      } else {
        this.setState({
          error: t('download.error.memory', {
            defaultValue: 'Unable to obtain account from memory'
          })
        });
      }
    } catch (e) {
      this.setState({
        error: t('download.error.file', {
          defaultValue: 'Unable to save file'
        })
      });
      console.error('Error retrieving account from local storage and saving account to file: ', e);
    }
  }

  showPasswordModal = (): void => {
    const { address } = this.state;

    if (!address) {
      return;
    }

    this.setState({
      isOpen: true,
      address,
      password: ''
    });
  }

  hideModal = (): void => {
    this.setState({ isOpen: false });
  }

  render () {
    const { address } = this.state;

    if (!address) {
      return null;
    }

    return (
      <div className='accounts--DownloadButton'>
        <DownloadModal
          {...this.props}
          {...this.state}
          handleDownloadAccount={this.handleDownloadAccount}
          hideModal={this.hideModal}
          onChangePassword={this.onChangePassword}
          onDiscard={this.onDiscard}
        />
        <Button
          {...this.props}
          icon='download'
          isCircular
          isPrimary
          onClick={this.showPasswordModal}
          size='tiny'
        />
      </div>
    );
  }

  emptyState (): State {
    const { address } = this.props;

    return {
      address: address ? address : '',
      password: '',
      isOpen: false,
      error: undefined
    };
  }

  onChangePassword = (password: string): void => {
    this.setState({
      password,
      error: undefined
    });
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export {
  DownloadButton
};

export default translate(DownloadButton);
