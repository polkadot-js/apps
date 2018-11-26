// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps, BareProps } from '@polkadot/ui-app/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { QueueTx, QueueTx$Id, QueueTx$MessageSetStatus, QueueTx$Result, QueueTx$Status } from './types';

import React from 'react';
import { decodeAddress } from '@polkadot/keyring';
import { Button, Modal } from '@polkadot/ui-app/index';
import keyring from '@polkadot/ui-keyring/index';
import { withApi, withMulti } from '@polkadot/ui-react-rx/with/index';
import { u8aToHex } from '@polkadot/util';
import { format } from '@polkadot/util/logger';
import { Extrinsic } from '@polkadot/types';

import Qr from './Qr';
import Transaction from './Transaction';
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
  isExternal?: boolean,
  password: string,
  signatureExternal?: Uint8Array,
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

  static getDerivedStateFromProps ({ queue }: Props, { currentItem, password, signatureExternal, unlockError }: State): State {
    const nextItem = queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      (
        (!nextItem.accountId && !currentItem.accountId) ||
        (
          (nextItem.accountId && nextItem.accountId.toString()) === (currentItem.accountId && currentItem.accountId.toString())
        )
      );

    let isExternal = false;

    if (currentItem && currentItem.accountId) {
      const pair = keyring.getPair(currentItem.accountId);

      isExternal = pair.getMeta().isExternal;
    }

    return {
      currentItem: nextItem,
      isExternal,
      password: isSame ? password : '',
      signatureExternal: isSame ? signatureExternal : void 0,
      unlockError: isSame ? unlockError : null
    };
  }

  async componentDidUpdate (prevProps: Props, prevState: State) {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued' && !currentItem.extrinsic) {
      return this.sendRpc(currentItem);
    }
  }

  render () {
    const { t } = this.props;
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
          <Button
            isPrimary
            onClick={this.onSend}
            tabIndex={2}
            text={
              t('extrinsic.signedSend', {
                defaultValue: 'Sign and Submit'
              })
            }
          />
        </Button.Group>
      </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction value={currentItem}>
        {this.renderQr()}
        {this.renderUnlock()}
      </Transaction>
    );
  }

  private renderQr () {
    const { apiObservable } = this.props;
    const { currentItem, isExternal } = this.state;

    if (!currentItem || !isExternal || !currentItem.accountId) {
      return null;
    }

    return (
      <Qr
        accountId={currentItem.accountId}
        blockHash={apiObservable.genesisHash}
        nonce={currentItem.accountNonce}
        onScan={this.onChangeSignature}
      />
    );
  }

  private renderUnlock () {
    const { t } = this.props;
    const { currentItem, isExternal, password, unlockError } = this.state;

    if (!currentItem || isExternal) {
      return null;
    }

    return (
      <Unlock
        autoFocus
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        onKeyDown={this.onKeyDown}
        password={password}
        value={currentItem.accountId}
        tabIndex={1}
      />
    );
  }

  private unlockAccount (accountId: string, password?: string): UnlockI18n | null {
    let publicKey;

    try {
      publicKey = decodeAddress(accountId);
    } catch (err) {
      console.error(err);
      return null;
    }

    const pair = keyring.getPair(publicKey);

    if (pair.getMeta().isExternal || !pair.isLocked()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      console.error(error);
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

  private onChangeSignature = (signatureExternal: Uint8Array): void => {
    this.setState({ signatureExternal });
  }

  private onSend = async (): Promise<any> => {
    const { currentItem, password, signatureExternal } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    return this.sendExtrinsic(currentItem, password, signatureExternal);
  }

  private sendRpc = async ({ id, rpc, values = [] }: QueueTx): Promise<void> => {
    if (!rpc) {
      return;
    }

    const { queueSetStatus } = this.props;

    queueSetStatus(id, 'sending');

    const { error, result, status } = await this.submitRpc(rpc, values);

    queueSetStatus(id, status, result, error);
  }

  private sendExtrinsic = async ({ extrinsic, id, accountNonce, accountId }: QueueTx, password?: string, signature?: Uint8Array): Promise<void> => {
    if (!extrinsic || !accountId) {
      return;
    }

    const unlockError = this.unlockAccount(accountId, password);

    if (unlockError) {
      this.setState({ unlockError });
      return;
    }

    const { apiObservable, queueSetStatus } = this.props;

    queueSetStatus(id, 'sending');

    const pair = keyring.getPair(accountId);

    console.log(`sendExtrinsic: from=${pair.address()}, nonce=${accountNonce}, blockHash=${apiObservable.genesisHash.toHex()}`);

    if (signature) {
      console.log(`sendExtrinsic: signature=${u8aToHex(signature)}`);
      extrinsic.addSignature(pair.publicKey(), signature, accountNonce);
    } else {
      extrinsic.sign(pair, accountNonce, apiObservable.genesisHash);
    }

    await this.submitExtrinsic(extrinsic, id);
  }

  private async submitRpc (rpc: RpcMethod, values: Array<any>): Promise<QueueTx$Result> {
    const { apiObservable } = this.props;

    try {
      const result = await apiObservable.rawCall(rpc, ...values).toPromise();

      console.log('submitRpc: result ::', format(result));

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

  private async submitExtrinsic (extrinsic: Extrinsic, id: QueueTx$Id): Promise<void> {
    const { apiObservable, queueSetStatus } = this.props;

    try {
      const encoded = extrinsic.toJSON();

      console.log('submitAndWatchExtrinsic: encode ::', encoded);

      apiObservable
        .submitAndWatchExtrinsic(extrinsic)
        .subscribe(
          (result) => {
            if (!result) {
              return;
            }

            const status = result.type.toLowerCase() as QueueTx$Status;

            console.log('submitAndWatchExtrinsic: updated status ::', result);

            queueSetStatus(id, status, result);
          },
          (error) => {
            console.error('submitAndWatchExtrinsic:', error);

            queueSetStatus(id, 'error', null, error);
          }
        );
    } catch (error) {
      console.error('submitAndWatchExtrinsic:', error);

      queueSetStatus(id, 'error', null, error);
    }
  }
}

export {
  Signer
};

export default withMulti(
  Signer,
  translate,
  withApi
);
