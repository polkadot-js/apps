// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { Call, Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { createType } from '@polkadot/types';
import { Button, Extrinsic, InputNumber } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends TxModalProps, ApiProps {
  memberCount: number;
}

interface State extends TxModalState {
  method: Call | null;
  threshold: BN | null;
}

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

  public static getDerivedStateFromProps ({ memberCount }: Props, { threshold }: State): Pick<State, never> | null {
    if (!threshold && memberCount > 0) {
      const simpleMajority = new BN((memberCount / 2) + 1);

      return { threshold: simpleMajority };
    }

    return null;
  }

  protected headerText = (): string => this.props.t('Propose a council motion');

  protected txMethod = (): string => 'council.propose';

  protected txParams = (): [BN | null, ...Proposal[]] => {
    const { method, threshold } = this.state;

    return [
      threshold,
      ...(method ? [createType('Proposal', method)] : [])
    ];
  }

  protected isDisabled = (): boolean => {
    const { memberCount = 0 } = this.props;
    const { accountId, method, threshold } = this.state;

    const hasThreshold = !!threshold && threshold.gtn(0) && threshold.ltn(memberCount + 1);
    const hasMethod = !!method;

    return !accountId || !hasMethod || !hasThreshold;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Propose a council motion')}
          icon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { apiDefaultTxSudo, memberCount = 0, t } = this.props;
    const { threshold } = this.state;

    return (
      <>
        <InputNumber
          className='medium'
          label={t('threshold')}
          help={t('The minimum number of council votes required to approve this motion')}
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

  private onChangeThreshold = (threshold: BN | null = null): void => {
    const { memberCount = 0 } = this.props;

    if (memberCount > 0 && !this.defaultState.threshold) {
      this.defaultState.threshold = new BN((memberCount / 2) + 1);
    }

    this.setState({ threshold });
  }

  private onChangeExtrinsic = (method?: Call): void => {
    if (!method) {
      return;
    }

    this.setState({ method });
  }
}

export default withMulti(
  Propose,
  translate,
  withCalls(
    ['query.electionsPhragmen.members', {
      fallbacks: ['query.elections.members'],
      propName: 'memberCount',
      transform: (value: any[]): number =>
        value.length
    }]
  )
);
