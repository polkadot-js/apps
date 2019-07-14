// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { Method, Proposal } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';

import { Button, Extrinsic, InputNumber } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';
import { withApi, withCalls, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = TxModalProps & ApiProps & {
  memberCount: number
};

type State = TxModalState & {
  method: Method | null,
  threshold: BN | null
};

class Propose extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      method: null,
      threshold: props.memberCount ? new BN((props.memberCount / 2) + 1) : null
    };
    this.state = this.defaultState;
  }

  static getDerivedStateFromProps ({ memberCount }: Props, { threshold }: State) {
    if (!threshold && memberCount > 0) {
      const simpleMajority = new BN((memberCount / 2) + 1);
      return { threshold: simpleMajority };
    }
    return null;
  }

  headerText = () => this.props.t('Make a collective proposal');

  txMethod = () => 'collective.propose';
  txParams = () => {
    const { method, threshold } = this.state;

    return [
      threshold,
      ...(method ? [new Proposal(method)] : [])
    ];
  }

  isDisabled = () => {
    const { memberCount = 0 } = this.props;
    const { accountId, method, threshold } = this.state;

    const hasThreshold = !!threshold && threshold.gtn(0) && threshold.ltn(memberCount + 1);
    const hasMethod = !!method;

    return !accountId || !hasMethod || !hasThreshold;
  }

  renderTrigger = () => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Make a collective proposal')}
          labelIcon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }

  renderContent = () => {
    const { apiDefaultTxSudo, memberCount = 0, t } = this.props;
    const { threshold } = this.state;

    return (
      <>
        <InputNumber
          className='medium'
          label={t('threshold')}
          help={t('The minimum number of collective votes required to approve this proposal')}
          isError={!threshold || threshold.eqn(0) || threshold.gtn(memberCount)}
          onChange={this.onChangeThreshold}
          onEnter={this.sendTx}
          placeholder={
            t(
              'Positive number between 1 and {{memberCount}}',
              { replace: { memberCount } }
            )
          }
          value={threshold || new BN(0)}
        />
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('proposal')}
          onChange={this.onChangeExtrinsic}
          onEnter={this.sendTx}
        />
      </>
    );
  }

  private onChangeThreshold = (threshold?: BN): void => {
    const { memberCount = 0 } = this.props;
    if (memberCount > 0 && !this.defaultState.threshold) {
      this.defaultState.threshold = new BN((memberCount / 2) + 1);
    }
    this.setState({ threshold } as State);
  }

  private onChangeExtrinsic = (method: Method): void => {
    if (!method) {
      return;
    }

    this.setState({ method } as State);
  }
}

export default withMulti(
  Propose,
  translate,
  withApi,
  withCalls(
    [
      'query.elections.members',
      {
        propName: 'memberCount',
        transform: (value: Array<any>) => value.length
      }
    ]
  )
);
