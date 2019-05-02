// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Index } from '@polkadot/types';
import { IExtrinsic } from '@polkadot/types/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { QueueTx, QueueTx$ExtrinsicAdd, TxCallback } from './Status/types';

import React from 'react';
import { withApi } from '@polkadot/ui-api';
import { assert, isFunction, isUndefined } from '@polkadot/util';

import { QueueConsumer } from './Status/Context';
import Button from './Button';

type ConstructFn = () => Array<any>;

type InjectedProps = {
  queueExtrinsic: QueueTx$ExtrinsicAdd;
  txqueue: Array<QueueTx>;
};

type Props = ApiProps & {
  accountId?: string,
  accountNonce?: Index,
  isPrimary?: boolean,
  isDisabled?: boolean,
  isNegative?: boolean,
  label: React.ReactNode,
  onClick?: () => any,
  onFailed?: TxCallback,
  onSuccess?: TxCallback,
  onUpdate?: TxCallback,
  params?: Array<any> | ConstructFn,
  tx?: string,
  extrinsic?: IExtrinsic | SubmittableExtrinsic
};

type InnerProps = Props & InjectedProps;

type State = {
  extrinsic: SubmittableExtrinsic,
  isSending: boolean
};

class TxButtonInner extends React.PureComponent<InnerProps> {
  state = {
    isSending: false
  } as State;

  static getDerivedStateFromProps ({ api, isDisabled, params = [], txqueue = [], tx = '', extrinsic: propsExtrinsic }: InnerProps): State | null {
    if (isDisabled || !propsExtrinsic && (!tx || tx.length === 0)) {
      return null;
    }

    let extrinsic: any;
    if (propsExtrinsic) {
      extrinsic = propsExtrinsic;
    } else {
      const [section, method] = tx.split('.');

      assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);

      extrinsic = api.tx[section][method](
        ...(isFunction(params) ? params() : params)
      );
    }

    let isSending = false;
    const queuedTx = txqueue.find(({ extrinsic: ex }) => ex === extrinsic);
    if (queuedTx) {
      isSending = ['broadcast', 'sending'].includes(queuedTx.status);
    }

    return {
      extrinsic,
      isSending
    };
  }

  render () {
    const { accountId, isDisabled, isNegative, isPrimary, label } = this.props;
    const { isSending } = this.state;

    return (
      <Button
        isDisabled={isSending || isDisabled || !accountId}
        isLoading={isSending}
        isNegative={isNegative}
        isPrimary={isUndefined(isPrimary) ? !isNegative : isPrimary}
        label={label}
        onClick={this.send}
      />
    );
  }

  private send = (): void => {
    const { accountId, onClick, onFailed, onSuccess, onUpdate, queueExtrinsic } = this.props;
    const { extrinsic } = this.state;

    assert(extrinsic, 'Expected generated extrinsic passed to TxButton');

    queueExtrinsic({
      accountId,
      extrinsic,
      txFailedCb: onFailed,
      txSuccessCb: onSuccess,
      txUpdateCb: onUpdate
    });

    onClick && onClick();
  }
}

class TxButton extends React.PureComponent<Props> {
  render () {
    return (
      <QueueConsumer>
        {({ queueExtrinsic, txqueue }) => (
          <TxButtonInner
            {...this.props}
            queueExtrinsic={queueExtrinsic}
            txqueue={txqueue}
          />
        )}
      </QueueConsumer>
    );
  }
}

export default withApi(TxButton);
