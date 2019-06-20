// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { Button, InputAddress, InputBalance, TxButton, TxComponent } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from './translate';

type Props = I18nProps & ApiProps & RouteComponentProps & {
  basePath: string
};

type State = {
  accountId?: string,
  beneficiary?: string,
  value: BN,
  isValid: boolean
};

class Propose extends TxComponent<Props, State> {
  state: State = {
    value: new BN(0),
    isValid: false
  };

  render () {
    const { t } = this.props;
    const { isValid, accountId, beneficiary, value } = this.state;
    const hasValue = !!value && value.gtn(0);
    const hasBeneficiary = !!beneficiary;

    return (
      <section>
        <InputAddress
          className='medium'
          label={t('account')}
          help={t('The account used to make the new spend proposal')}
          type='account'
          onChange={this.onChangeAccount}
        />
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
        <Button.Group>
          <TxButton
            accountId={accountId}
            label={t('Submit')}
            tx='treasury.proposeSpend'
            isDisabled={!isValid}
            params={[
              ...(hasValue ? [value] : []),
              ...(hasBeneficiary ? [beneficiary] : [])
            ]}
            onSuccess={this.onSubmitProposal}
            ref={this.button}
          />
        </Button.Group>
      </section>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { accountId = prevState.accountId, beneficiary = prevState.beneficiary, value = prevState.value } = newState;
        const isValid = !!beneficiary && !!value && value.gt(new BN(0)) && !!accountId && accountId.length > 0;

        return {
          accountId,
          beneficiary,
          value,
          isValid
        };
      }
    );
  }

  private onChangeAccount = (accountId: string): void => {
    this.nextState({ accountId } as State);
  }

  private onChangeBeneficiary = (beneficiary: string): void => {
    this.nextState({ beneficiary } as State);
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value } as State);
  }

  private onSubmitProposal = () => {
    const { history, basePath } = this.props;

    history.push(basePath);
  }
}

export default withMulti(
  Propose,
  translate,
  withApi,
  withRouter
);
