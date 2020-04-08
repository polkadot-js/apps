// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { CalculateBalanceProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import { Available, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withApi, withMulti } from '@polkadot/react-api/hoc';

import translate from '../../translate';
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
        header= {t('Bond more funds')}
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={stashId}
            extrinsic={extrinsic}
            icon='sign-in'
            isDisabled={!canSubmit}
            isPrimary
            label={t('Bond more')}
            onStart={onClose}
            withSpinner
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { stashId, t } = this.props;
    const { amountError, maxAdditional, maxBalance } = this.state;

    return (
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
          labelExtra={
            <Available
              label={<span className='label'>{t('transferrable')}</span>}
              params={stashId}
            />
          }
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
        />
        <ValidateAmount
          accountId={stashId}
          onError={this.setAmountError}
          value={maxAdditional}
        />
      </Modal.Content>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, maxAdditional = prevState.maxAdditional, maxBalance = prevState.maxBalance } = newState;
      const extrinsic: any = (maxAdditional && maxAdditional.gte(ZERO))
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
