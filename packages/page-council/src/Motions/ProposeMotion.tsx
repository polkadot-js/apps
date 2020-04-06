// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiProps } from '@polkadot/react-api/types';
import { Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { registry, withApi, withMulti } from '@polkadot/react-api';
import { Button, Extrinsic, InputNumber } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';
import { createType } from '@polkadot/types';

import translate from '../translate';

interface Props extends TxModalProps, ApiProps {
  isMember: boolean;
  members: string[];
}

interface State extends TxModalState {
  method: SubmittableExtrinsic<'promise'> | null;
  threshold: BN | null;
}

class Propose extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      method: null,
      threshold: props.members.length ? new BN(Math.ceil(props.members.length * 0.5)) : null
    };
    this.state = this.defaultState;
  }

  public static getDerivedStateFromProps ({ members }: Props, { threshold }: State): Pick<State, never> | null {
    if (!threshold && members.length) {
      return { threshold: new BN(Math.ceil(members.length * 0.5)) };
    }

    return null;
  }

  protected headerText = (): string => this.props.t('Propose a council motion');

  protected txMethod = (): string => 'council.propose';

  protected txParams = (): [BN | null, ...Proposal[]] => {
    const { method, threshold } = this.state;

    return [
      threshold,
      ...(method ? [createType(registry, 'Proposal', method)] : [])
    ];
  }

  protected isDisabled = (): boolean => {
    const { members } = this.props;
    const { accountId, method, threshold } = this.state;

    const hasThreshold = !!threshold && threshold.gtn(0) && threshold.ltn(members.length + 1);
    const hasMethod = !!method;

    return !accountId || !hasMethod || !hasThreshold;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { isMember, t } = this.props;

    return (
      <Button
        icon='add'
        isDisabled={!isMember}
        label={t('Propose motion')}
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { apiDefaultTxSudo, members, t } = this.props;
    const { threshold } = this.state;

    return (
      <>
        <InputNumber
          className='medium'
          help={t('The minimum number of council votes required to approve this motion')}
          isError={!threshold || threshold.eqn(0) || threshold.gtn(members.length)}
          label={t('threshold')}
          onChange={this.onChangeThreshold}
          onEnter={this.sendTx}
          placeholder={
            t(
              'Positive number between 1 and {{memberCount}}',
              { replace: { memberCount: members.length } }
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
    const { members } = this.props;

    if (members.length && !this.defaultState.threshold) {
      this.defaultState.threshold = new BN(Math.ceil(members.length * 0.5));
    }

    this.setState({ threshold });
  }

  private onChangeExtrinsic = (method?: SubmittableExtrinsic<'promise'>): void => {
    if (!method) {
      return;
    }

    this.setState({ method });
  }
}

export default withMulti(
  translate(Propose),
  withApi
);
