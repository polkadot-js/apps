/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { CalculateBalanceProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import { Available, Button, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { calcSignatureLength } from '@polkadot/react-signer/Checks';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withApi, withMulti } from '@polkadot/react-api';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/react-signer/Checks/constants';
import { bnMax } from '@polkadot/util';

import translate from '../../translate';
import detectUnsafe from '../../unsafeChains';

interface Props extends I18nProps, ApiProps, CalculateBalanceProps {
  controllerId: string;
  isOpen: boolean;
  isUnsafeChain: boolean;
  onClose: () => void;
  stashId: string;
}

interface State {
  extrinsic: SubmittableExtrinsic | null;
  maxAdditional?: BN;
  maxBalance?: BN;
}

const ZERO = new BN(0);

class BondExtra extends TxComponent<Props, State> {
  public state: State = {
    extrinsic: null
  };

  public componentDidUpdate (prevProps: Props, prevState: State): void {
    const { balances_fees } = this.props;
    const { extrinsic } = this.state;

    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((balances_fees !== prevProps.balances_fees) ||
      hasLengthChanged
    ) {
      this.setMaxBalance();
    }
  }

  public render (): React.ReactNode {
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

  private renderContent (): React.ReactNode {
    const { isUnsafeChain, stashId, t } = this.props;
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
            withMax={!isUnsafeChain}
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

  private setMaxBalance = (): void => {
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
      const fees = transactionBaseFee.add(transactionByteFee.mul(txLength));

      maxBalance = bnMax(availableBalance.sub(fees), ZERO);
    }

    this.nextState({
      extrinsic,
      maxAdditional,
      maxBalance
    });
  }

  private onChangeValue = (maxAdditional?: BN): void => {
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
    ['query.system.accountNonce', { paramName: 'stashId' }],
    ['rpc.system.chain', {
      propName: 'isUnsafeChain',
      transform: detectUnsafe
    }]
  )
);
