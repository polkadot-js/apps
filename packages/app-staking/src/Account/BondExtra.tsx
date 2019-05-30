// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { CalculateBalanceProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { Option, StakingLedger } from '@polkadot/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withApi, withMulti } from '@polkadot/ui-api';
import { calcSignatureLength } from '@polkadot/ui-signer/Checks';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/ui-signer/Checks/constants';

import translate from '../translate';

type Props = I18nProps & ApiProps & CalculateBalanceProps & {
  accountId: string,
  controllerId: string,
  isOpen: boolean,
  onClose: () => void,
  staking_ledger?: Option<StakingLedger>
};

type State = {
  maxAdditional?: BN,
  extrinsic: SubmittableExtrinsic | null,
  maxBalance?: BN
};

const ZERO = new BN(0);

class BondExtra extends TxComponent<Props, State> {
  state: State = {
    extrinsic: null
  };

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { balances_fees } = this.props;
    const { extrinsic } = this.state;

    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((balances_fees !== prevProps.balances_fees) ||
      hasLengthChanged
    ) {
      this.setMaxBalance();
    }
  }

  render () {
    const { accountId, balances_all = ZERO_BALANCE, isOpen, onClose, t } = this.props;
    const { extrinsic, maxAdditional, maxBalance = balances_all.availableBalance } = this.state;
    const canSubmit = !!maxAdditional && maxAdditional.gtn(0) && maxAdditional.lte(maxBalance);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--BondExtra'
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
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond')}
              onClick={onClose}
              extrinsic={extrinsic}
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, t } = this.props;
    const { maxBalance } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Bond Extra')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('stash account')}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('The maximum amount to increase the bonded value, this is adjusted using the available free funds on the account.')}
            label={t('max additional value')}
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
      const { api } = this.props;
      const { maxAdditional = prevState.maxAdditional, maxBalance = prevState.maxBalance } = newState;
      const extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra(maxAdditional)
        : null;

      return {
        maxAdditional,
        extrinsic,
        maxBalance
      };
    });
  }

  private setMaxBalance = () => {
    const { api, system_accountNonce = ZERO, balances_fees = ZERO_FEES, balances_all = ZERO_BALANCE, staking_ledger } = this.props;
    const { maxAdditional } = this.state;

    const { transactionBaseFee, transactionByteFee } = balances_fees;
    const { freeBalance } = balances_all;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    let bonded = new BN(0);
    if (staking_ledger && !staking_ledger.isNone) {
      bonded = staking_ledger.unwrap().active;
    }

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;

      extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra(maxAdditional.sub(bonded))
        : null;

      const txLength = calcSignatureLength(extrinsic, system_accountNonce);

      const fees = transactionBaseFee
        .add(transactionByteFee.muln(txLength));

      maxBalance = new BN(freeBalance).sub(fees).sub(bonded);
    }

    this.nextState({
      extrinsic,
      maxBalance
    });
  }

  private onChangeValue = (maxAdditional?: BN) => {
    this.nextState({ maxAdditional });
  }
}

export default withMulti(
  BondExtra,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees',
    ['derive.balances.all', { paramName: 'accountId' }],
    ['query.system.accountNonce', { paramName: 'accountId' }],
    ['query.staking.ledger', { paramName: 'controllerId' }]
  )
);
