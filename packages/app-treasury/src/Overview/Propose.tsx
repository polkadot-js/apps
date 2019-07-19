// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

import { Button, InputAddress, InputBalance } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

type Props = TxModalProps;

interface State extends TxModalState {
  beneficiary?: string;
  value: BN;
}

class Propose extends TxModal<Props, State> {
  public state: State = {
    ...this.defaultState,
    value: new BN(0)
  };

  protected headerText = (): string => this.props.t('Submit a spend proposal');

  protected txMethod = (): string => 'treasury.proposeSpend';

  protected txParams = (): (string | BN | undefined)[] => {
    const { beneficiary, value } = this.state;

    return [
      value, beneficiary
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId, beneficiary, value } = this.state;
    const hasValue = !!value && value.gtn(0);
    const hasBeneficiary = !!beneficiary;

    return !accountId || !hasValue || !hasBeneficiary;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit a spend proposal')}
          labelIcon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { value } = this.state;
    const hasValue = !!value && value.gtn(0);

    return (
      <>
        <InputAddress
          className='medium'
          label={t('beneficiary')}
          help={t('The account to which the proposed balance will be transferred if approved')}
          type='allPlus'
          onChange={this.onChangeBeneficiary}
        />
        <InputBalance
          className='medium'
          isError={!hasValue}
          help={t('The amount that will be allocated from the treasury pot')}
          label={t('value')}
          onChange={this.onChangeValue}
          onEnter={this.sendTx}
        />
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): Pick<State, never> => {
        const { accountId = prevState.accountId, beneficiary = prevState.beneficiary, value = prevState.value } = newState;

        return {
          accountId,
          beneficiary,
          value
        };
      }
    );
  }

  private onChangeBeneficiary = (beneficiary: string): void => {
    this.nextState({ beneficiary });
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value });
  }
}

export default translate(Propose);
