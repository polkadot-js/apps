// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { CalculateBalanceProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import { Available, Button, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { calcSignatureLength } from '@polkadot/ui-signer/Checks';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withApi, withMulti } from '@polkadot/ui-api';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/ui-signer/Checks/constants';

import translate from '../../translate';

type Props = I18nProps & ApiProps & CalculateBalanceProps & {
  controllerId: string,
  isOpen: boolean,
  onClose: () => void,
  stashId: string
};

type State = {
  extrinsic: SubmittableExtrinsic | null,
  maxAdditional?: BN,
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
    const { balances_all = ZERO_BALANCE, isOpen, onClose, stashId, t } = this.props;
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
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond more')}
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
    const { stashId, t } = this.props;
    const { maxBalance } = this.state;
    const available = <span className='label'>{t('available ')}</span>;

    return (
      <>
        <Modal.Header>
          {t('Bond more funds')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={stashId}
            isDisabled
            label={t('stash account')}
            labelExtra={<Available label={available} params={stashId} />}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
            label={t('additionnal bonded funds')}
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
        extrinsic,
        maxAdditional,
        maxBalance
      };
    });
  }

  private setMaxBalance = () => {
    const { api, system_accountNonce = ZERO, balances_fees = ZERO_FEES, balances_all = ZERO_BALANCE } = this.props;
    const { maxAdditional } = this.state;

    const { transactionBaseFee, transactionByteFee } = balances_fees;
    const { availableBalance } = balances_all;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;

      extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra(maxAdditional)
        : null;

      const txLength = calcSignatureLength(extrinsic, system_accountNonce);

      const fees = transactionBaseFee
        .add(transactionByteFee.muln(txLength));

      maxBalance = availableBalance.sub(fees);
    }

    this.nextState({
      extrinsic,
      maxAdditional,
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
    ['derive.balances.all', { paramName: 'stashId' }],
    ['query.system.accountNonce', { paramName: 'stashId' }]
  )
);
