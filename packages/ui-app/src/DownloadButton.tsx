// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Button$Sizes } from './Button/types';
import { BareProps } from './types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import './DownloadButton.css';

import React from 'react';
/// <reference path="./@types/file-saver/index.d.ts" />
import FileSaver from 'file-saver';
import keyring from '@polkadot/ui-keyring/index';
import withApi from '@polkadot/ui-react-rx/with/api';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import isUndefined from '@polkadot/util/is/undefined';

import Button from './Button';
import Modal from './Modal';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';

type State = {
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  unlockError: UnlockI18n | null
};

type Props = I18nProps & ApiProps & BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  address: string
};

type UnlockI18n = {
  key: string,
  value: any // I18Next$Translate$Config
};

class DownloadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleDownloadAccount = (): void => {
    const { address, password } = this.state;

    try {
      const json: KeyringPair$Json = keyring.toJson(address, password);

      console.log('json', json);

      if (!isUndefined(json)) {
        const blob: Blob = new Blob([JSON.stringify(json)], { type: 'text/plain;charset=utf-8' });

        FileSaver.saveAs(blob, `paritytech-polkadot-publickey-${address}.json`);
      } else {
        console.error('Error obtaining account data to save to file');
      }
    } catch (e) {
      console.error('Error retrieving account from local storage and saving account to file: ', e);
    }
  }

  showPasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: true });
  }

  hidePasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: false });
  }

  render () {
    const { address, isPasswordModalOpen } = this.state;
    const { className, icon = 'download', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;

    if (!address) {
      return null;
    }

    // TODO - do not duplicate this from Address component. move into common utility for reuse
    const shortValue = `${address.slice(0, 7)}…${address.slice(-7)}`;

    return (
      <div className={'accounts--Address-download'}>
        { isPasswordModalOpen ? (
            <Modal
              dimmer='inverted'
              open={isPasswordModalOpen}
              onClose={this.hidePasswordModal}
              size={'mini'}
            >
              <Modal.Content>
                <div className='ui--grid'>
                  <div className={'accounts--Address accounts--Address-modal'}>
                    <IdentityIcon
                      className='accounts--Address-icon'
                      size={48}
                      value={address}
                    />
                    <div className='accounts--Address-data'>
                      <div className='accounts--Address-address'>
                        {shortValue}
                      </div>
                    </div>
                    {this.renderContent()}
                  </div>
                  {this.renderButtons()}
                </div>
              </Modal.Content>
            </Modal>
          ) : null
        }
        <Button
          className={className}
          icon={icon}
          isCircular={isCircular}
          isPrimary={isPrimary}
          onClick={this.showPasswordModal}
          size={size}
          style={style}
        />
      </div>
    );
  }

  renderContent () {
    const { address } = this.state;

    // FIXME - need to refresh the page after creating an account since the address won't be available
    if (!address) {
      return null;
    }

    return (
      <div>
        { this.renderUnlock() }
      </div>
    );
  }

  renderUnlock () {
    const { t } = this.props;
    const { address, password, unlockError } = this.state;

    if (!address) {
      return null;
    }

    const keyringAddress: KeyringAddress = keyring.getAddress(address);

    return (
      <Unlock
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        password={password}
        passwordWidth={'full'}
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onDiscard}
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={false}
            isPrimary
            onClick={this.onSubmit}
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  emptyState (): State {
    const { address } = this.props;

    return {
      address: address,
      password: '',
      isPasswordModalOpen: false,
      unlockError: null
    };
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const {
          password = prevState.password,
          isPasswordModalOpen = prevState.isPasswordModalOpen,
          unlockError = prevState.unlockError
        } = newState;

        let address = prevState.address;

        return {
          address,
          password,
          isPasswordModalOpen,
          unlockError
        };
      }
    );
  }

  onChangePassword = (password: string): void => {
    this.nextState({ password, unlockError: null } as State);
    this.setState({
      password,
      unlockError: null
    });
  }

  onSubmit = (): void => {
    const { address } = this.state;

    if (!address) {
      return;
    }

    this.handleDownloadAccount();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

const Component: React.ComponentType<any> = translate(
  withApi(DownloadButton)
);

export default Component;
