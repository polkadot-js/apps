// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { createType } from '@polkadot/types';
import { Button, Extrinsic, InputAddress, InputBalance, TxButton, TxComponent } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from './translate';

type Props = I18nProps & ApiProps & RouteComponentProps & {
  basePath: string;
};

interface State {
  accountId?: string;
  method: Call | null;
  value: BN;
  isValid: boolean;
}

class Propose extends TxComponent<Props, State> {
  public state: State = {
    method: null,
    value: new BN(0),
    isValid: false
  };

  public render (): React.ReactNode {
    const { apiDefaultTxSudo, t } = this.props;
    const { isValid, accountId, method, value } = this.state;
    const hasValue = !!value && value.gtn(0);

    return (
      <section>
        <InputAddress
          className='medium'
          label={t('account')}
          help={t('The account used to make the new proposal')}
          type='account'
          onChange={this.onChangeAccount}
        />
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
        <Button.Group>
          <TxButton
            accountId={accountId}
            label={t('Submit')}
            tx='democracy.propose'
            isDisabled={!isValid}
            params={[
              ...(method ? [createType('Proposal', method)] : []),
              ...(hasValue ? [value] : [])
            ]}
            onSuccess={this.onSubmitProposal}
            ref={this.button}
          />
        </Button.Group>
      </section>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
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

  private onChangeAccount = (accountId: string): void => {
    this.nextState({ accountId });
  }

  private onChangeExtrinsic = (method: Call): void => {
    if (!method) {
      return;
    }

    this.nextState({ method });
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value });
  }

  private onSubmitProposal = (): void => {
    const { history, basePath } = this.props;

    history.push(basePath);
  }
}

export default withMulti(
  Propose,
  translate,
  withRouter,
  withApi
);
