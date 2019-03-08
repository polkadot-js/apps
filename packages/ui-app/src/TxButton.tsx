// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { QueueTx$ExtrinsicAdd, TxCallback } from './Status/types';

import React from 'react';
import { withApi } from '@polkadot/ui-api/index';
import { assert } from '@polkadot/util';

import { QueueConsumer } from './Status/Context';
import Button from './Button';

type InjectedProps = {
  queueExtrinsic: QueueTx$ExtrinsicAdd;
};

type Props = ApiProps & {
  accountId?: string,
  isDisabled?: boolean,
  label: React.ReactNode,
  onFailed?: TxCallback,
  onSuccess?: TxCallback,
  onUpdate?: TxCallback,
  params: Array<any>,
  tx: string
};

class TxButtonInner extends React.PureComponent<Props & InjectedProps> {
  render () {
    const { accountId, isDisabled, label } = this.props;

    return (
      <Button
        isDisabled={isDisabled || !accountId}
        isPrimary
        label={label}
        onClick={this.send}
      />
    );
  }

  private send = (): void => {
    const { accountId, api, onFailed, onSuccess, onUpdate, params, queueExtrinsic, tx } = this.props;
    const [section, method] = tx.split('.');

    assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);

    queueExtrinsic({
      accountId,
      extrinsic: api.tx[section][method](...params) as any, // ???
      txFailedCb: onFailed,
      txSuccessCb: onSuccess,
      txUpdateCb: onUpdate
    });
  }
}

class TxButton extends React.PureComponent<Props> {
  render () {
    return (
      <QueueConsumer>
        {({ queueExtrinsic }) => (
          <TxButtonInner
            {...this.props}
            queueExtrinsic={queueExtrinsic}
          />
        )}
      </QueueConsumer>
    );
  }
}

export default withApi(TxButton);
