// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { InputAddress, InputBalance } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & ApiProps & RouteComponentProps & TxModalProps;

type State = TxModalState & {
  beneficiary?: string,
  value: BN
};

class Propose extends TxModal<Props, State> {
  state: State = {
    ...this.defaultState,
    value: new BN(0)
  };

  headerText = 'Submit a spend proposal';

  txMethod = () => 'treasury.proposeSpend';
  txParams = () => {
    const { beneficiary, value } = this.state;

    return [
      value, beneficiary
    ];
  }

  isDisabled = () => {
    const { accountId, beneficiary, value } = this.state;
    const hasValue = !!value && value.gtn(0);
    const hasBeneficiary = !!beneficiary;

    return !accountId || !hasValue || !hasBeneficiary;
  }

  renderContent = () => {
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

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { accountId = prevState.accountId, beneficiary = prevState.beneficiary, value = prevState.value } = newState;

        return {
          accountId,
          beneficiary,
          value
        } as State;
      }
    );
  }

  private onChangeBeneficiary = (beneficiary: string): void => {
    this.nextState({ beneficiary } as State);
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value } as State);
  }
}

export default withMulti(
  Propose,
  translate,
  withApi,
  withRouter
);
