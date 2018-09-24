// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps, BareProps } from '@polkadot/ui-app/types';
import { QueueTx, QueueTx$MessageSetStatus, QueueTx$Result } from './types';

import React from 'react';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import keyring from '@polkadot/ui-keyring/index';
import withApi from '@polkadot/ui-react-rx/with/api';
import { format } from '@polkadot/util/logger';
import { UncheckedMortalExtrinsic } from '@polkadot/types';

import Extrinsic from './Extrinsic';
import Unlock from './Unlock';
import translate from './translate';

type BaseProps = BareProps & {
  queue: Array<QueueTx>,
  queueSetStatus: QueueTx$MessageSetStatus
};

type Props = I18nProps & ApiProps & BaseProps;

type UnlockI18n = {
  key: string,
  value: any // I18Next$Translate$Config
};

type State = {
  currentItem?: QueueTx,
  password: string,
  unlockError: UnlockI18n | null
};

class Signer extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      password: '',
      unlockError: null
    };
  }

  static getDerivedStateFromProps ({ queue }: Props, { currentItem, password, unlockError }: State): State {
    const nextItem = queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      (
        (!nextItem.ss58 && !currentItem.ss58) ||
        (
          (nextItem.ss58 && nextItem.ss58.toString()) === (currentItem.ss58 && currentItem.ss58.toString())
        )
      );

    return {
      currentItem: nextItem,
      password: isSame ? password : '',
      unlockError: isSame ? unlockError : null
    };
  }

  async componentDidUpdate (prevProps: Props, prevState: State) {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued') {
      return this.sendItem(currentItem);
    }
  }

  render () {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal
        className='ui--signer-Signer'
        dimmer='inverted'
        open
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onCancel}
            tabIndex={3}
            text={t('extrinsic.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <div>
            <Button
              className='ui--signer-Signer-Submit'
              isPrimary
              onClick={this.onSend}
              tabIndex={2}
              text={
                t('extrinsic.signedSend', {
                  defaultValue: 'Sign and Submit'
                })
              }
            />
          </div>
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Extrinsic value={currentItem}>
        {this.renderUnlock()}
      </Extrinsic>
    );
  }

  private renderUnlock () {
    const { t } = this.props;
    const { currentItem, password, unlockError } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Unlock
        autoFocus
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        onKeyDown={this.onKeyDown}
        password={password}
        value={currentItem.ss58}
        tabIndex={1}
      />
    );
  }

  private unlockAccount (accountId: string, password?: string): UnlockI18n | null {
    let publicKey;

    try {
      publicKey = addressDecode(accountId);
    } catch (err) {
      console.error(err);
      return null;
    }

    const pair = keyring.getPair(publicKey);

    if (!pair.isLocked()) {
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

  private onChangePassword = (password: string): void => {
    this.setState({
      password,
      unlockError: null
    });
  }

  private onKeyDown = async (event: React.KeyboardEvent<Element>): Promise<any> => {
    if (event.key === 'Enter') {
      await this.onSend();
    }
  }

  private onCancel = (): void => {
    const { queueSetStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    queueSetStatus(currentItem.id, 'cancelled');
  }

  private onSend = async (): Promise<any> => {
    const { currentItem, password } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    return this.sendItem(currentItem, password);
  }

  private sendItem = async ({ extrinsic, id, accountNonce, accountId }: QueueTx, password?: string): Promise<void> => {
    let publicKey;

    try {
      publicKey = addressDecode(accountId);
    } catch (err) {
      console.error(err);
      return null;
    }

    const pair = keyring.getPair(publicKey);

    if (publicKey) {
      const unlockError = this.unlockAccount(publicKey, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    const { apiObservable, queueSetStatus } = this.props;

    queueSetStatus(id, 'sending');

    if (publicKey) {
      const pair = keyring.getPair(publicKey);

      console.error('signing:', pair.address(), accountNonce.toString(), apiObservable.genesisHash.toHex());

      extrinsic.sign(pair, accountNonce, apiObservable.genesisHash);
    }

    const { error, result, status } = await this.submitExtrinsic(extrinsic);

    queueSetStatus(id, status, result, error);
  }

  private async submitExtrinsic (extrinsic: UncheckedMortalExtrinsic): Promise<QueueTx$Result> {
    const { apiObservable } = this.props;

    try {
      const encoded = extrinsic.toJSON();

      console.log('submitExtrinsic: encode ::', encoded);

      const result = await apiObservable.submitExtrinsic(extrinsic).toPromise();

      console.log('submitExtrinsic: result ::', format(result));

      return {
        result,
        status: 'sent'
      };
    } catch (error) {
      console.error(error);

      return {
        error,
        status: 'error'
      };
    }
  }
}

const Component: React.ComponentType<any> = translate(
  withApi(Signer)
);

export {
  Signer
};

export default Component;
