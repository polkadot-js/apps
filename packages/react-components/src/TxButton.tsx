// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/react-api/types';
import { assert, isFunction, isUndefined } from '@polkadot/util';
import { Index } from '@polkadot/types/interfaces';
import { IExtrinsic } from '@polkadot/types/types';
import { QueueTx, QueueTxExtrinsicAdd, TxCallback, TxFailedCallback } from './Status/types';

import React from 'react';
import { SubmittableResult } from '@polkadot/api';
import { withApi } from '@polkadot/react-api';

import Button from './Button';
import { Button$Sizes } from './Button/types';
import { QueueConsumer } from './Status/Context';

type ConstructFn = () => any[];

interface InjectedProps {
  queueExtrinsic: QueueTxExtrinsicAdd;
  txqueue: QueueTx[];
}

interface Props extends ApiProps {
  accountId?: string;
  accountNonce?: Index;
  className?: string;
  extrinsic?: IExtrinsic | SubmittableExtrinsic;
  icon: string;
  iconSize?: Button$Sizes;
  isBasic?: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
  isPrimary?: boolean;
  isUnsigned?: boolean;
  label: React.ReactNode;
  onClick?: () => any;
  onFailed?: TxFailedCallback;
  onStart?: () => void;
  onSuccess?: TxCallback;
  onUpdate?: TxCallback;
  params?: any[] | ConstructFn;
  tooltip?: string;
  tx?: string;
  withSpinner?: boolean;
}

type InnerProps = Props & InjectedProps;

interface State {
  extrinsic?: SubmittableExtrinsic;
  isSending: boolean;
}

class TxButtonInner extends React.PureComponent<InnerProps> {
  public state: State = {
    isSending: false
  };

  public render (): React.ReactNode {
    const { accountId, className, icon, iconSize, isBasic, isDisabled, isNegative, isPrimary, isUnsigned, label, tooltip } = this.props;
    const { isSending } = this.state;
    const needsAccount = isUnsigned
      ? false
      : !accountId;

    return (
      <Button
        className={className}
        tooltip={tooltip}
        icon={icon}
        isBasic={isBasic}
        isDisabled={isSending || isDisabled || needsAccount}
        isLoading={isSending}
        isNegative={isNegative}
        isPrimary={
          isUndefined(isPrimary)
            ? (!isNegative && !isBasic)
            : isPrimary
        }
        label={label}
        onClick={this.send}
        size={iconSize}
      />
    );
  }

  protected send = (): void => {
    const { accountId, api, extrinsic: propsExtrinsic, isUnsigned, onClick, onFailed, onStart, onSuccess, onUpdate, params = [], queueExtrinsic, tx = '', withSpinner = true } = this.props;
    let extrinsic: any;

    if (propsExtrinsic) {
      extrinsic = propsExtrinsic;
    } else {
      const [section, method] = tx.split('.');

      assert(api.tx[section] && api.tx[section][method], `Unable to find api.tx.${section}.${method}`);

      extrinsic = api.tx[section][method](...(
        isFunction(params)
          ? params()
          : params
      ));
    }

    assert(extrinsic, 'Expected generated extrinsic passed to TxButton');

    if (withSpinner) {
      this.setState({ isSending: true });
    }

    queueExtrinsic({
      accountId,
      extrinsic,
      isUnsigned,
      txFailedCb: withSpinner ? this.onFailed : onFailed,
      txStartCb: onStart,
      txSuccessCb: withSpinner ? this.onSuccess : onSuccess,
      txUpdateCb: onUpdate
    });

    onClick && onClick();
  }

  private onFailed = (result: SubmittableResult | null): void => {
    const { onFailed } = this.props;

    this.setState({ isSending: false });

    onFailed && onFailed(result);
  }

  private onSuccess = (result: SubmittableResult): void => {
    const { onSuccess } = this.props;

    this.setState({ isSending: false });

    onSuccess && onSuccess(result);
  }
}

class TxButton extends React.PureComponent<Props, State> {
  protected button: any = React.createRef();

  public render (): React.ReactNode {
    return (
      <QueueConsumer>
        {({ queueExtrinsic, txqueue }): React.ReactNode => (
          <TxButtonInner
            {...this.props}
            queueExtrinsic={queueExtrinsic}
            txqueue={txqueue}
            ref={this.button}
          />
        )}
      </QueueConsumer>
    );
  }

  protected send = (): void => {
    this.button.current.send();
  }
}

export default withApi(TxButton);
