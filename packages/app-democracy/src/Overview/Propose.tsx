// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import { createType } from '@polkadot/types';
import { Button, Extrinsic, InputBalance } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';
import { withApi, withMulti } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends TxModalProps, ApiProps {}

interface State extends TxModalState {
  accountId?: string | null;
  method: Call | null;
  value: BN;
  isValid: boolean;
}

class Propose extends TxModal<Props, State> {
  public state: State = {
    ...this.defaultState,
    value: new BN(0)
  };

  protected headerText = (): string => this.props.t('Submit proposal');

  protected txMethod = (): string => 'democracy.propose';

  protected txParams = (): [Call, BN] => {
    const { value, method } = this.state;
    return [createType('Proposal', method), value];
  }

  protected isDisabled = (): boolean => {
    const { accountId, value, method } = this.state;
    const hasValue = !!value && value.gtn(0);
    const hasMethod = !!method;

    return !accountId || !hasValue || !hasMethod;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit proposal')}
          icon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { apiDefaultTxSudo, t } = this.props;
    const { value } = this.state;
    const hasValue = !!value && value.gtn(0);

    return (
      <section>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('propose')}
          onChange={this.onChangeExtrinsic}
          onEnter={this.sendTx}
        />
        <InputBalance
          className='medium'
          isError={!hasValue}
          help={t('The amount that will be bonded to submit the proposal')}
          label={t('value')}
          onChange={this.onChangeValue}
          onEnter={this.sendTx}
        />
      </section>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): Pick<State, never> => {
        const { accountId = prevState.accountId, method = prevState.method, value = prevState.value } = newState;
        const isValid = !!method && !!value && value.gt(new BN(0)) && !!accountId && accountId.length > 0;

        return {
          accountId,
          method,
          value,
          isValid
        };
      }
    );
  }

  private onChangeExtrinsic = (method?: Call): void => {
    if (!method) {
      return;
    }

    this.nextState({ method });
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value });
  }
}

export default withMulti(
  withApi(Propose),
  translate
);
