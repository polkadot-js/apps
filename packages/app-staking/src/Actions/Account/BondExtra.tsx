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
import { calcTxLength } from '@polkadot/react-signer/Checks';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withApi, withMulti } from '@polkadot/react-api';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/react-signer/Checks/constants';
import { bnMax } from '@polkadot/util';

import translate from '../../translate';
import detectUnsafe from '../../unsafeChains';
import ValidateAmount from './InputValidateAmount';

interface Props extends I18nProps, ApiProps, CalculateBalanceProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
}

interface State {
  amountError: string | null;
  extrinsic: SubmittableExtrinsic | null;
  maxAdditional?: BN;
  maxBalance?: BN;
}

const ZERO = new BN(0);

class BondExtra extends TxComponent<Props, State> {
  public state: State = {
    amountError: null,
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
    const { isOpen, onClose, stashId, t } = this.props;
    const { extrinsic, maxAdditional } = this.state;
    const canSubmit = !!maxAdditional && maxAdditional.gtn(0);

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
              icon='cancel'
            />
            <Button.Or />
            <TxButton
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond more')}
              icon='sign-in'
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
    const { stashId, systemChain, t } = this.props;
    const { amountError, maxAdditional, maxBalance } = this.state;
    const transferrable = <span className='label'>{t('transferrable ')}</span>;
    const isUnsafeChain = detectUnsafe(systemChain);

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
            labelExtra={<Available label={transferrable} params={stashId} />}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
            isError={!!amountError || !maxAdditional || maxAdditional.eqn(0)}
            label={t('additional bonded funds')}
            maxValue={maxBalance}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            withMax={!isUnsafeChain}
          />
          <ValidateAmount
            accountId={stashId}
            onError={this.setAmountError}
            value={maxAdditional}
          />
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, maxAdditional = prevState.maxAdditional, maxBalance = prevState.maxBalance } = newState;
      const extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra(maxAdditional)
        : null;

      return {
        amountError,
        extrinsic,
        maxAdditional,
        maxBalance
      };
    });
  }

  private setMaxBalance = (): void => {
    const { api, balances_fees = ZERO_FEES, balances_all = ZERO_BALANCE } = this.props;
    const { maxAdditional } = this.state;

    const { transactionBaseFee, transactionByteFee } = balances_fees;
    const { accountNonce, freeBalance } = balances_all;

    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;
      extrinsic = (maxAdditional && maxAdditional.gte(ZERO))
        ? api.tx.staking.bondExtra(maxAdditional)
        : null;

      const txLength = calcTxLength(extrinsic, accountNonce);
      const fees = transactionBaseFee.add(transactionByteFee.mul(txLength));

      maxBalance = bnMax(freeBalance.sub(fees), ZERO);
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

  private setAmountError = (amountError: string | null): void => {
    this.setState({ amountError });
  }
}

export default withMulti(
  BondExtra,
  translate,
  withApi,
  withCalls<Props>(
    'derive.balances.fees'
  )
);
