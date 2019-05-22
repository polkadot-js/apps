// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, Option, StakingLedger } from '@polkadot/types';
import { Button, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { withCalls, withApi, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & ApiProps & {
  controllerId?: AccountId | null,
  isOpen: boolean,
  onClose: () => void,
  staking_ledger?: Option<StakingLedger>
};

type State = {
  maxBalance?: BN
  maxUnbond?: BN
};

class Unbond extends TxComponent<Props, State> {
  state: State = {};

  componentDidUpdate (prevProps: Props) {
    const { staking_ledger } = this.props;

    if (staking_ledger !== prevProps.staking_ledger) {
      this.setMaxBalance();
    }
  }

  render () {
    const { controllerId, isOpen, onClose, t } = this.props;
    const { maxUnbond } = this.state;
    const canSubmit = !!maxUnbond && maxUnbond.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Unbond'
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
              accountId={controllerId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Unbond')}
              onClick={onClose}
              params={[maxUnbond]}
              tx='staking.unbond'
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { controllerId, t } = this.props;
    const { maxBalance } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Unbond')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controller account')}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('The maximum amount to unbond, this is adjusted using the bonded funds on the account.')}
            label={t('unbond amount')}
            maxValue={maxBalance}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            withMax
          />
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { maxUnbond = prevState.maxUnbond, maxBalance = prevState.maxBalance } = newState;

      return {
        maxUnbond,
        maxBalance
      };
    });
  }

  private setMaxBalance = () => {
    const { staking_ledger } = this.props;

    if (!staking_ledger || staking_ledger.isNone) {
      return;
    }

    const { active: maxBalance } = staking_ledger.unwrap();

    this.nextState({
      maxBalance
    });
  }

  private onChangeValue = (maxUnbond?: BN) => {
    this.nextState({ maxUnbond });
  }
}

export default withMulti(
  Unbond,
  translate,
  withApi,
  withCalls<Props>(
    ['query.staking.ledger', { paramName: 'controllerId' }]
  )
);
