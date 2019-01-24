// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/promise/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { Button } from '@polkadot/ui-app/index';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

type InjectedProps = {
  queueExtrinsic: QueueTx$ExtrinsicAdd;
};

type Props = {
  accountId?: string,
  isDisabled: boolean,
  label: React.ReactNode,
  params: Array<any>,
  tx: SubmittableExtrinsicFunction
};

class TxButton extends React.PureComponent<Props & InjectedProps> {
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
    const { accountId, params, queueExtrinsic, tx } = this.props;

    queueExtrinsic({
      accountId,
      extrinsic: tx(...params)
    });
  }
}

export default class TxButtonWrap extends React.PureComponent<Props> {
  render () {
    return (
      <QueueConsumer>
        {({ queueExtrinsic }) => (
          <TxButton
            {...this.props}
            queueExtrinsic={queueExtrinsic}
          />
        )}
      </QueueConsumer>
    );
  }
}
