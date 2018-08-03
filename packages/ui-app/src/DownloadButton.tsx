// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { Button$Sizes } from './Button/types';
import { BareProps } from './types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { QueueTx, QueueTx$MessageSetStatus } from '@polkadot/ui-signer/types';

import './DownloadButton.css';

import React from 'react';
/// <reference path="./@types/file-saver/index.d.ts" />
import FileSaver from 'file-saver';
import keyring from '@polkadot/ui-keyring/index';
import withApi from '@polkadot/ui-react-rx/with/api';
import classes from '@polkadot/ui-app/util/classes';
import isUndefined from '@polkadot/util/is/undefined';

import Address from '@polkadot/app-accounts/Address';
import Button from './Button';
import Modal from './Modal';
import Unlock from '@polkadot/ui-signer/Unlock';
import signMessage from '@polkadot/ui-signer/sign';
import submitMessage from '@polkadot/ui-signer/submit';

import translate from './translate';

type State = {
  currentItem?: QueueTx,
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  unlockError: UnlockI18n | null
};

type BaseProps = BareProps & {
  queue: Array<QueueTx>,
  queueSetStatus: QueueTx$MessageSetStatus
};

type Props = I18nProps & ApiProps & BaseProps & BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  address: string,
  onBack: () => void
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

  static getDerivedStateFromProps ({ queue }: Props, { currentItem, address, password, isPasswordModalOpen, unlockError }: State): State {
    const nextItem = queue && queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      (
        (!nextItem.publicKey && !currentItem.publicKey) ||
        (
          (nextItem.publicKey && nextItem.publicKey.toString()) === (currentItem.publicKey && currentItem.publicKey.toString())
        )
      );

    return {
      currentItem: nextItem,
      address: address,
      password: isSame ? password : '',
      isPasswordModalOpen: isPasswordModalOpen,
      unlockError: isSame ? unlockError : null
    };
  }

  async componentDidUpdate (prevProps: Props, prevState: State) {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued' && currentItem.rpc.isSigned !== true) {
      return this.sendItem(currentItem);
    } else {
      this.handleDownloadAccount();
    }
  }

  handleDownloadAccount = (): void => {
    const { password } = this.state;
    const { address } = this.props;

    try {
      const json: KeyringPair$Json = keyring.toJson(address, password);

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
    const { currentItem, address, isPasswordModalOpen } = this.state;
    const { className, icon = 'download', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;

    if (!currentItem || !address || currentItem.rpc.isSigned !== true) {
      return null;
    }

    return (
      <div
        className={classes('accounts--Address-download', className)}
        style={style}
      >
        { isPasswordModalOpen ? (
            <Modal
              dimmer='inverted'
              open={isPasswordModalOpen}
              onClose={this.hidePasswordModal}
              size={'mini'}
            >
              <Modal.Content>
                <div className='ui--grid'>
                  <div>
                    <Address
                      className='shrink'
                      hideAllFileIcons={true}
                      value={address ? address : ''}
                    />
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
    const { currentItem } = this.state;

    if (!currentItem) {
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
    const { currentItem, password, unlockError } = this.state;

    // const json: KeyringPair$Json = keyring.toJson(address, password);
    // const publicKey = json.encoded;

    if (!currentItem) {
      return null;
    }

    return (
      <Unlock
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        password={password}
        value={currentItem.publicKey}
      />
    );
  }

  unlockAccount (publicKey: Uint8Array, password?: string): UnlockI18n | null {
    const pair = keyring.getPair(publicKey);

    if (pair.hasSecretKey()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      return {
        key: 'signer.unlock.generic',
        value: {
          defaultValue: error.message
        }
      };
    }

    return null;
  }

  renderButtons () {
    const { t } = this.props;
    const { currentItem: { rpc: { isSigned = false } = {} } = {} } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            onClick={this.onDiscard}
            text={t('creator.discard', {
              defaultValue: 'Reset'
            })}
          />
          <Button.Or />
          <Button
              isNegative
              onClick={this.onCancel}
              text={t('creator.cancel', {
                defaultValue: 'Cancel'
              })}
            />
          <Button.Or />
          <Button
            isDisabled={false}
            isPrimary
            onClick={this.onSend}
            text={
              isSigned
                ? t('creator.signedSend', {
                  defaultValue: 'Sign and Submit'
                })
                : t('creator.send', {
                  defaultValue: 'Submit'
                })
            }
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

  onCancel = (): void => {
    const { queueSetStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    queueSetStatus(currentItem.id, 'cancelled');
  }

  onSend = async (): Promise<any> => {
    const { currentItem, password } = this.state;
    // const { onBack } = this.props;

    if (!currentItem) {
      return;
    }

    return this.sendItem(currentItem, password);

    // onBack();
  }

  sendItem = async ({ id, nonce, publicKey, rpc, values }: QueueTx, password?: string): Promise<void> => {
    if (rpc.isSigned === true && publicKey) {
      const unlockError = this.unlockAccount(publicKey, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    const { api, apiSupport, queueSetStatus } = this.props;

    queueSetStatus(id, 'sending');

    let data = values;

    if (rpc.isSigned === true && publicKey) {
      data = [
        signMessage(
          publicKey, nonce, (data[0] as Uint8Array), apiSupport
        ).data
      ];
    }

    const { error, result, status } = await submitMessage(api, data, rpc);

    queueSetStatus(id, status, result, error);
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

const Component: React.ComponentType<any> = translate(
  withApi(DownloadButton)
);

export default Component;
