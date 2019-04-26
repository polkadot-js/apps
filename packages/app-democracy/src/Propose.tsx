// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Method, Proposal } from '@polkadot/types';

import { Button, Extrinsic, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from './translate';

type Props = I18nProps & ApiProps & {
  controllerId?: AccountId | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  accountId?: string,
  method: Method | null,
  value: BN,
  isValid: boolean
};

class Propose extends React.PureComponent<Props, State> {
  state: State = {
    method: null,
    value: new BN(0),
    isValid: false
  };
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { isOpen, onClose, t } = this.props;
    const { isValid, accountId, method, value } = this.state;
    const hasValue = !!value && value.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Bonding'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              label={t('Submit')}
              tx='democracy.propose'
              isDisabled={!isValid}
              params={[
                ...(method ? [new Proposal(method)] : []),
                ...(hasValue ? [value] : [])
              ]}
              onClick={onClose}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { api, apiDefaultTx, t } = this.props;
    const { value } = this.state;
    const hasValue = !!value && value.gtn(0);

    const defaultExtrinsic = (() => {
      try {
        return api.tx.consensus.setCode;
      } catch (error) {
        return apiDefaultTx;
      }
    })();

    return (
      <>
        <Modal.Header>
          {t('Bonding Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            label={t('using the following account')}
            type='account'
            onChange={this.onChangeAccount}
          />
          <Extrinsic
            defaultValue={defaultExtrinsic}
            label={t('propose')}
            onChange={this.onChangeExtrinsic}
          />
          <InputBalance
            className='medium'
            isError={!hasValue}
            label={t('value')}
            onChange={this.onChangeValue}
          />
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: State): void {
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
    this.nextState({ accountId } as State);
  }

  private onChangeExtrinsic = (method: Method): void => {
    if (!method) {
      return;
    }

    this.nextState({ method } as State);
  }

  private onChangeValue = (value?: BN): void => {
    this.nextState({ value } as State);
  }
}

export default withMulti(
  Propose,
  translate,
  withApi
);
